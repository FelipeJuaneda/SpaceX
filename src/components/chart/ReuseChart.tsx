import { m, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import type { LaunchSummary } from "@/types/domain";
import { cumulative, reuseFirsts, time } from "@/features/launches/selectors";
import { useElementSize } from "@/hooks/useElementSize";
import { formatInt, formatNet } from "@/lib/format";
import s from "./ReuseChart.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Three pens climbing from 2015: flights flown (carbon), boosters landed (cobalt),
 * flights on flight-proven boosters (dashed cobalt).
 */
export function ReuseChart({ launches }: { launches: readonly LaunchSummary[] }) {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const reduce = useReducedMotion();
  const points = useMemo(() => cumulative(launches), [launches]);
  const { firstLanding, firstReflight } = useMemo(() => reuseFirsts(launches), [launches]);
  const width = size?.width ?? 0;
  const narrow = width < 640;
  const last = points.at(-1);

  const byYear = useMemo(() => {
    const rows = new Map<number, { flights: number; landed: number; reflights: number }>();
    for (const p of points) rows.set(new Date(p.t).getUTCFullYear(), p);
    return [...rows.entries()].filter(([year]) => year >= 2015);
  }, [points]);

  if (!last) return null;

  const start = Date.UTC(2015, 0, 1);
  const end = last.t;
  const H = narrow ? 260 : 320;
  const M = { t: 16, r: narrow ? 8 : 168, b: 36, l: 40 };
  const yMax = Math.ceil(last.flights / 100) * 100;
  const x = (t: number) =>
    M.l + ((Math.max(t, start) - start) / (end - start)) * (width - M.l - M.r);
  const y = (v: number) => M.t + (1 - v / yMax) * (H - M.t - M.b);

  const visible = points.filter((p) => p.t >= start);
  const before = points.filter((p) => p.t < start).at(-1);
  const series = before ? [{ ...before, t: start }, ...visible] : visible;
  const line = (key: "flights" | "landed" | "reflights") =>
    series.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p[key]).toFixed(1)}`).join("");

  const ends = [
    { key: "flights", label: `${formatInt(last.flights)} flights`, v: last.flights },
    { key: "landed", label: `${formatInt(last.landed)} boosters landed`, v: last.landed },
    {
      key: "reflights",
      label: `${formatInt(last.reflights)} on reused boosters`,
      v: last.reflights,
    },
  ].map((e) => ({ ...e, y: y(e.v) }));
  // Keep end labels at least 18px apart.
  ends.sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) {
    const prev = ends[i - 1]!;
    const cur = ends[i]!;
    if (cur.y - prev.y < 18) cur.y = prev.y + 18;
  }

  const years: number[] = [];
  for (let yr = 2015; yr <= new Date(end).getUTCFullYear(); yr++) years.push(yr);
  const gridValues = Array.from({ length: yMax / 200 + 1 }, (_, i) => i * 200).filter(
    (v) => v <= yMax,
  );

  const annotations = [
    firstLanding && { l: firstLanding, text: "First booster landing" },
    firstReflight && { l: firstReflight, text: "First reflight" },
  ].filter(Boolean) as { l: LaunchSummary; text: string }[];

  return (
    <figure className={s.figure}>
      <div ref={ref} className={s.canvas} style={{ height: H }}>
        {width > 0 && (
          <svg width={width} height={H} className={s.svg} aria-hidden="true" focusable="false">
            {gridValues.map((v) => (
              <g key={v}>
                <line
                  x1={M.l}
                  x2={width - M.r}
                  y1={y(v)}
                  y2={y(v)}
                  className={v ? s.grid : s.axis}
                />
                <text x={M.l - 8} y={y(v) + 4} textAnchor="end" className={s.legend}>
                  {v}
                </text>
              </g>
            ))}
            {years.map((yr) =>
              narrow && yr % 2 ? null : (
                <text key={yr} x={x(Date.UTC(yr, 0, 1))} y={H - 12} className={s.legend}>
                  {narrow ? `’${String(yr).slice(2)}` : yr}
                </text>
              ),
            )}

            {(["flights", "landed", "reflights"] as const).map((key, i) => (
              <m.path
                key={key}
                d={line(key)}
                className={s[key]}
                initial={{ pathLength: reduce ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.6, delay: reduce ? 0 : i * 0.25, ease: EASE }}
              />
            ))}

            {annotations.map(({ l, text }, i) => {
              const p = points.find((pt) => pt.t === time(l));
              if (!p) return null;
              const ax = x(p.t);
              const ay = y(text.includes("reflight") ? p.reflights : p.landed);
              const ly = M.t + 14 + i * 36;
              return (
                <g key={text}>
                  <line x1={ax} x2={ax} y1={ay} y2={ly + 6} className={s.leader} />
                  <circle cx={ax} cy={ay} r={3.5} className={s.dot} />
                  <text x={ax + 6} y={ly} className={s.note}>
                    {text}
                  </text>
                  <text x={ax + 6} y={ly + 14} className={s.noteSub}>
                    {l.mission} · {formatNet(l.net, "month")}
                  </text>
                </g>
              );
            })}

            {!narrow &&
              ends.map((e) => (
                <text key={e.key} x={width - M.r + 10} y={e.y + 4} className={s[`end-${e.key}`]}>
                  {e.label}
                </text>
              ))}
          </svg>
        )}
      </div>

      <ul className={s.key}>
        <li className={s.keyFlights}>{ends.find((e) => e.key === "flights")?.label}</li>
        <li className={s.keyLanded}>{ends.find((e) => e.key === "landed")?.label}</li>
        <li className={s.keyReflights}>{ends.find((e) => e.key === "reflights")?.label}</li>
      </ul>

      {/* Tables ignore overflow, so the hiding wrapper must be a block. */}
      <div className="visually-hidden">
        <table>
          <caption>
            Cumulative flights, booster landings and reflights at the end of each year
          </caption>
          <thead>
            <tr>
              <th scope="col">Year</th>
              <th scope="col">Flights</th>
              <th scope="col">Boosters landed</th>
              <th scope="col">Flights on reused boosters</th>
            </tr>
          </thead>
          <tbody>
            {byYear.map(([year, p]) => (
              <tr key={year}>
                <th scope="row">{year}</th>
                <td>{p.flights}</td>
                <td>{p.landed}</td>
                <td>{p.reflights}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
