import { m, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import type { LaunchSummary } from "@/types/domain";
import { between, isFailure, isFlown, time } from "@/features/launches/selectors";
import { useElementSize } from "@/hooks/useElementSize";
import { useI18n } from "@/i18n/useI18n";
import { formatMonthShort, isPrecise } from "@/lib/format";
import s from "./RecentTrace.module.css";

const DAY = 86_400_000;
const PAST_DAYS = 60;
const FUTURE_DAYS = 30;
const HEIGHT = 200;
const BASE = 118;
const SPIKE = 44;
const FAIL_SPIKE = 86;
const DOT_Y = 142;
const LABEL_Y = 188;

/** A baseline with one spike per flight: what a recorder pen draws. */
function tracePath(xs: number[], x0: number, x1: number, height: number): string {
  let d = `M${x0.toFixed(1)},${BASE}`;
  for (const x of xs) {
    d += `L${(x - 2.2).toFixed(1)},${BASE}L${x.toFixed(1)},${BASE - height}L${(x + 2.2).toFixed(1)},${BASE}`;
  }
  return `${d}L${x1.toFixed(1)},${BASE}`;
}

interface Props {
  launches: readonly LaunchSummary[];
  now: number;
}

/** The head of the roll: the last 60 days already drawn, the next 30 dashed ahead of the pen. */
export function RecentTrace({ launches, now }: Props) {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const msg = useI18n().m;
  const reduce = useReducedMotion();
  const from = now - PAST_DAYS * DAY;
  const to = now + FUTURE_DAYS * DAY;

  const { past, future } = useMemo(
    () => ({
      past: between(launches, from, now).filter(isFlown),
      future: between(launches, now, to).filter(
        (l) => l.outcome === "upcoming" && (isPrecise(l.precision) || l.precision === "day"),
      ),
    }),
    [launches, from, now, to],
  );

  const failures = past.filter(isFailure).length;
  const landed = past.reduce((n, l) => n + l.landings.landed, 0);
  const width = size?.width ?? 0;
  const x = (t: number) => ((t - from) / (to - from)) * width;
  const nowX = x(now);

  const months: { x: number; label: string }[] = [];
  if (width) {
    const d = new Date(from);
    let cursor = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1);
    while (cursor < to) {
      months.push({ x: x(cursor), label: formatMonthShort(cursor) });
      const c = new Date(cursor);
      cursor = Date.UTC(c.getUTCFullYear(), c.getUTCMonth() + 1, 1);
    }
  }

  return (
    <figure className={s.figure}>
      <div ref={ref} className={s.canvas} style={{ height: HEIGHT }}>
        {width > 0 && (
          <svg className={s.svg} width={width} height={HEIGHT} aria-hidden="true" focusable="false">
            {months.map((mo) => (
              <g key={mo.label + mo.x}>
                <line x1={mo.x} x2={mo.x} y1={20} y2={DOT_Y + 14} className={s.monthLine} />
                <text x={mo.x + 4} y={LABEL_Y} className={s.month}>
                  {mo.label}
                </text>
              </g>
            ))}

            <m.path
              d={tracePath(
                past.map((l) => x(time(l))),
                0,
                nowX,
                SPIKE,
              )}
              className={s.trace}
              initial={{ pathLength: reduce ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
            {past.filter(isFailure).map((l) => {
              const fx = x(time(l));
              return (
                <path
                  key={l.slug}
                  d={`M${fx - 3},${BASE}L${fx},${BASE - FAIL_SPIKE}L${fx + 3},${BASE}`}
                  className={s.fail}
                />
              );
            })}
            {past.flatMap((l) =>
              Array.from({ length: l.landings.attempted }, (_, i) => (
                <circle
                  key={`${l.slug}-${i}`}
                  cx={x(time(l))}
                  cy={DOT_Y + i * 7}
                  r={2.6}
                  className={i < l.landings.landed ? s.landed : s.lost}
                />
              )),
            )}

            <m.path
              d={tracePath(
                future.map((l) => x(time(l))),
                nowX,
                width,
                SPIKE,
              )}
              className={s.future}
              initial={{ opacity: reduce ? 1 : 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : 1.2, duration: 0.5 }}
            />

            <line x1={nowX} x2={nowX} y1={16} y2={DOT_Y + 14} className={s.now} />
            <path
              d={`M${nowX - 6},${BASE - 10}L${nowX},${BASE}L${nowX + 6},${BASE - 10}Z`}
              className={s.pen}
            />
            <text x={nowX} y={10} textAnchor="middle" className={s.nowLabel}>
              {msg.charts.now}
            </text>
          </svg>
        )}
      </div>
      <figcaption className={s.caption}>
        {msg.charts.recentCaption(past.length, failures, landed, future.length)}
      </figcaption>
    </figure>
  );
}
