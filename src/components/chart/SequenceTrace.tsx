import { m, useReducedMotion } from "motion/react";
import type { TimelineEvent } from "@/types/domain";
import { useElementSize } from "@/hooks/useElementSize";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import { formatOffset } from "@/lib/format";
import s from "./SequenceTrace.module.css";

const ROW_H = 32;
const CHAR_W = 6.6;
const EASE = [0.22, 1, 0.36, 1] as const;
const MARKS = [-3600, -1800, -600, -60, 0, 60, 600, 3600];

/** "T−00:38:00" → "T−38:00" when under an hour, which is most of a countdown. */
function short(t: number): string {
  const full = formatOffset(t);
  return Math.abs(t) < 3600 ? full.replace(/^(T.)00:/, "$1") : full;
}

interface Placed {
  event: TimelineEvent;
  x: number;
  row: number;
  anchorEnd: boolean;
}

function layout(
  events: TimelineEvent[],
  x: (t: number) => number,
  width: number,
): { placed: Placed[]; rows: number } {
  const rowEnds: number[] = [];
  const placed = events.map((event) => {
    const ex = x(event.t);
    const w = Math.max(event.label.length, short(event.t).length) * CHAR_W + 14;
    const anchorEnd = ex + w > width;
    const left = anchorEnd ? ex - w : ex - 2;
    const right = anchorEnd ? ex + 2 : ex + w;
    let row = rowEnds.findIndex((end) => end < left);
    if (row === -1) {
      row = rowEnds.length;
      rowEnds.push(right);
    } else rowEnds[row] = right;
    return { event, x: ex, row, anchorEnd };
  });
  return { placed, rows: Math.max(1, rowEnds.length) };
}

interface Props {
  events: TimelineEvent[];
  /** Upcoming flights plot the planned sequence as a dashed, undrawn trace. */
  planned: boolean;
}

/**
 * The countdown net as a strip chart: every call from propellant load to payload deploy,
 * plotted on a square-root time axis so the seconds around T-0 get room.
 */
export function SequenceTrace({ events, planned }: Props) {
  const msg = useI18n().m;
  const [ref, size] = useElementSize<HTMLDivElement>();
  const width = size?.width ?? 0;
  const wide = width >= 720;

  return (
    <figure className={s.figure}>
      <div ref={ref} className={s.canvas}>
        {wide && <Horizontal events={events} width={width} planned={planned} />}
        <ol className={cn(wide ? "visually-hidden" : s.list, planned && s.plannedList)}>
          {events.map((e, i) => (
            <li key={`${e.t}-${i}`} className={cn(s.item, e.t === 0 && s.zero, e.t > 0 && s.after)}>
              <span className={cn("reading", s.time)}>{short(e.t)}</span>
              <span className={s.label}>{e.label}</span>
              {e.description && <span className={s.desc}>{e.description}</span>}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className={s.caption}>
        {planned ? msg.charts.sequencePlanned : msg.charts.sequenceFlown}
        {msg.charts.sequenceCalls(events.length)}
        {wide && msg.charts.sequenceScale}
      </figcaption>
    </figure>
  );
}

function Horizontal({
  events,
  width,
  planned,
}: {
  events: TimelineEvent[];
  width: number;
  planned: boolean;
}) {
  const reduce = useReducedMotion();
  const sq = (t: number) => Math.sign(t) * Math.sqrt(Math.abs(t));
  const lo = sq(Math.min(0, ...events.map((e) => e.t)));
  const hi = sq(Math.max(0, ...events.map((e) => e.t)));
  const PAD = 12;
  const x = (t: number) => PAD + ((sq(t) - lo) / (hi - lo || 1)) * (width - 2 * PAD);

  const { placed, rows } = layout(events, x, width);
  const BASE = 24 + rows * ROW_H + 20;
  const HEIGHT = BASE + 52;
  const labelY = (row: number) => BASE - 30 - row * ROW_H;

  let d = `M${PAD},${BASE}`;
  for (const p of placed) {
    const spike = p.event.t === 0 ? BASE - 12 : 9;
    d += `L${(p.x - 2.5).toFixed(1)},${BASE}L${p.x.toFixed(1)},${BASE - spike}L${(p.x + 2.5).toFixed(1)},${BASE}`;
  }
  d += `L${width - PAD},${BASE}`;
  const zero = x(0);
  const marks = MARKS.filter((t) => sq(t) >= lo && sq(t) <= hi);

  return (
    <svg width={width} height={HEIGHT} className={s.svg} aria-hidden="true" focusable="false">
      {marks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={BASE + 4} y2={BASE + 12} className={s.markTick} />
          <text x={x(t)} y={BASE + 28} textAnchor="middle" className={s.mark}>
            {t === 0
              ? "T-0"
              : t < 0
                ? `−${Math.abs(t) >= 3600 ? "1h" : `${Math.abs(t) / 60}m`}`
                : `+${t >= 3600 ? "1h" : `${t / 60}m`}`}
          </text>
        </g>
      ))}

      <line x1={zero} x2={zero} y1={8} y2={BASE + 12} className={s.zeroLine} />

      {placed.map((p, i) => (
        <m.g
          key={`${p.event.t}-${i}`}
          initial={{ opacity: reduce ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: reduce ? 0 : 0.4 + (i / placed.length) * 1.4, duration: 0.3 }}
        >
          <line x1={p.x} x2={p.x} y1={labelY(p.row) + 6} y2={BASE - 10} className={s.leader} />
          <text
            x={p.anchorEnd ? p.x + 2 : p.x - 2}
            y={labelY(p.row) - 12}
            textAnchor={p.anchorEnd ? "end" : "start"}
            className={s.offset}
          >
            {short(p.event.t)}
          </text>
          <text
            x={p.anchorEnd ? p.x + 2 : p.x - 2}
            y={labelY(p.row) + 2}
            textAnchor={p.anchorEnd ? "end" : "start"}
            className={cn(s.eventLabel, p.event.t === 0 && s.zeroLabel)}
          >
            {p.event.label}
          </text>
        </m.g>
      ))}

      {planned ? (
        <m.path
          d={d}
          className={cn(s.trace, s.planned)}
          initial={{ opacity: reduce ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        />
      ) : (
        <m.path
          d={d}
          className={s.trace}
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 2, ease: EASE }}
        />
      )}
    </svg>
  );
}
