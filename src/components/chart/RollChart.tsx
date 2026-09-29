import { m, useReducedMotion } from "motion/react";
import { useId, useMemo, useState, type PointerEvent } from "react";
import { Link, useNavigate } from "react-router";
import type { LaunchSummary } from "@/types/domain";
import {
  cadence,
  isFailure,
  isFlown,
  time,
  yearStats,
  type YearStat,
} from "@/features/launches/selectors";
import { useElementSize } from "@/hooks/useElementSize";
import { OUTCOME_LABEL, formatInt, formatNet } from "@/lib/format";
import s from "./RollChart.module.css";

const START = Date.UTC(2006, 0, 1);
const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  launches: readonly LaunchSummary[];
  now: number;
}

/**
 * Two decades on one roll. Wide screens get a continuous multi-channel strip chart;
 * narrow screens get the same record stacked a year per row, newest at the top.
 */
export function RollChart({ launches, now }: Props) {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const flown = useMemo(() => launches.filter(isFlown), [launches]);
  const years = useMemo(() => yearStats(launches), [launches]);
  const width = size?.width ?? 0;
  const busiest = years.reduce<YearStat | undefined>(
    (a, b) => (!a || b.flights > a.flights ? b : a),
    undefined,
  );

  return (
    <figure className={s.figure}>
      <div ref={ref} className={s.canvas}>
        {width === 0 ? (
          <div className={s.placeholder} />
        ) : width < 640 ? (
          <YearRows flown={flown} years={years} width={width} />
        ) : (
          <Continuous flown={flown} launches={launches} years={years} width={width} now={now} />
        )}
      </div>
      <figcaption className={s.caption}>
        {formatInt(flown.length)} flights from {years[0]?.year} to {years.at(-1)?.year}.{" "}
        {busiest && `The busiest year was ${busiest.year}, with ${formatInt(busiest.flights)}.`}{" "}
        Each year opens its page of the flight log.
      </figcaption>
    </figure>
  );
}

function Continuous({
  flown,
  launches,
  years,
  width,
  now,
}: {
  flown: LaunchSummary[];
  launches: readonly LaunchSummary[];
  years: YearStat[];
  width: number;
  now: number;
}) {
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const clipId = useId();
  const [hover, setHover] = useState<LaunchSummary | null>(null);

  const CAD_TOP = 28;
  const CAD_H = 128;
  const FL_TOP = CAD_TOP + CAD_H + 28;
  const FL_H = 44;
  const LD_TOP = FL_TOP + FL_H + 16;
  const LD_H = 24;
  const AXIS_Y = LD_TOP + LD_H + 10;
  const HEIGHT = AXIS_Y + 44;

  const x = (t: number) => ((t - START) / (now - START)) * width;
  const points = useMemo(() => cadence(launches, now), [launches, now]);
  const maxN = Math.max(1, ...points.map((p) => p.n));
  const yCad = (n: number) => CAD_TOP + CAD_H - (n / maxN) * CAD_H;

  const cadPath = points
    .map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${yCad(p.n).toFixed(1)}`)
    .join("");
  let ok = "";
  let failed = "";
  let landed = "";
  let lost = "";
  const xs: number[] = [];
  for (const l of flown) {
    const lx = x(time(l)).toFixed(1);
    xs.push(Number(lx));
    if (isFailure(l)) failed += `M${lx},${FL_TOP - 16}V${FL_TOP + FL_H}`;
    else ok += `M${lx},${FL_TOP}V${FL_TOP + FL_H}`;
    if (l.landings.landed > 0) landed += `M${lx},${LD_TOP}V${LD_TOP + LD_H}`;
    else if (l.landings.attempted > 0) lost += `M${lx},${LD_TOP + LD_H / 2}V${LD_TOP + LD_H}`;
  }

  const labelEvery = width / years.length >= 48 ? 1 : 2;

  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
    let lo = 0;
    let hi = xs.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if ((xs[mid] ?? 0) < px) lo = mid + 1;
      else hi = mid;
    }
    const candidates = [lo - 1, lo].filter((i) => i >= 0 && i < xs.length);
    const best = candidates.sort(
      (a, b) => Math.abs((xs[a] ?? 0) - px) - Math.abs((xs[b] ?? 0) - px),
    )[0];
    setHover(
      best !== undefined && Math.abs((xs[best] ?? 0) - px) < 12 ? (flown[best] ?? null) : null,
    );
  };

  const hx = hover ? x(time(hover)) : 0;

  return (
    <div className={s.continuous} style={{ height: HEIGHT }}>
      <svg className={s.svg} width={width} height={HEIGHT} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId}>
            <m.rect
              x={0}
              y={0}
              height={HEIGHT}
              initial={{ width: reduce ? width : 0 }}
              whileInView={{ width }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.8, ease: EASE }}
            />
          </clipPath>
        </defs>

        {years.map((y) => {
          const yx = x(Date.UTC(y.year, 0, 1));
          return (
            <line
              key={y.year}
              x1={yx}
              x2={yx}
              y1={CAD_TOP - 8}
              y2={AXIS_Y}
              className={s.yearLine}
            />
          );
        })}
        <line x1={0} x2={width} y1={CAD_TOP + CAD_H} y2={CAD_TOP + CAD_H} className={s.axis} />
        <line x1={0} x2={width} y1={yCad(maxN)} y2={yCad(maxN)} className={s.maxLine} />

        <m.path
          d={cadPath}
          className={s.cadence}
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.8, ease: EASE }}
        />

        <g clipPath={`url(#${clipId})`}>
          <path d={ok} className={s.tick} />
          <path d={failed} className={s.failTick} />
          <path d={landed} className={s.landTick} />
          <path d={lost} className={s.lostTick} />
          {flown.filter(isFailure).map((l) => {
            const fx = x(time(l));
            return (
              <path
                key={l.slug}
                d={`M${fx - 4},${FL_TOP - 28}L${fx + 4},${FL_TOP - 20}M${fx + 4},${FL_TOP - 28}L${fx - 4},${FL_TOP - 20}`}
                className={s.failMark}
              />
            );
          })}
        </g>

        {hover && <line x1={hx} x2={hx} y1={CAD_TOP - 8} y2={AXIS_Y} className={s.hoverLine} />}
        <rect
          x={0}
          y={0}
          width={width}
          height={AXIS_Y}
          fill="transparent"
          className={s.hit}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          onClick={() => hover && navigate(`/launches/${hover.slug}`)}
        />
      </svg>

      <span className={s.channel} style={{ top: CAD_TOP - 24 }}>
        Flights in the trailing 30 days · peak {maxN}
      </span>
      <span className={s.channel} style={{ top: FL_TOP - 22 }}>
        Each flight · failures in red
      </span>
      <span className={s.channel} style={{ top: LD_TOP + LD_H + 12, left: "auto", right: 0 }}>
        Booster landings
      </span>

      {hover && (
        <p
          className={s.readout}
          style={{ left: Math.min(Math.max(hx - 140, 0), width - 280) }}
          aria-hidden="true"
        >
          <span>#{hover.flight}</span> {formatNet(hover.net, "day")} ·{" "}
          <strong>{hover.mission}</strong> · {OUTCOME_LABEL[hover.outcome]}
        </p>
      )}

      <ol className={s.years} aria-label="Flights by year">
        {years.map((y, i) => (
          <li
            key={y.year}
            style={{ left: x(Date.UTC(y.year, 0, 1)) }}
            className={i % labelEvery ? s.skip : undefined}
          >
            <Link to={`/launches?year=${y.year}`} className={s.year}>
              <span aria-hidden="true">
                {labelEvery > 1 ? `’${String(y.year).slice(2)}` : y.year}
              </span>
              <span className="visually-hidden">
                {y.year}: {formatInt(y.flights)} flights
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

function YearRows({
  flown,
  years,
  width,
}: {
  flown: LaunchSummary[];
  years: YearStat[];
  width: number;
}) {
  const reduce = useReducedMotion();
  const band = Math.max(120, width - 64 - 48);
  const byYear = useMemo(() => {
    const map = new Map<number, LaunchSummary[]>();
    for (const l of flown) {
      const y = new Date(l.net).getUTCFullYear();
      map.set(y, [...(map.get(y) ?? []), l]);
    }
    return map;
  }, [flown]);

  return (
    <ol className={s.rows}>
      {[...years].reverse().map((y, i) => {
        const list = byYear.get(y.year) ?? [];
        let ok = "";
        let failed = "";
        let landed = "";
        for (const l of list) {
          const d = new Date(l.net);
          const day =
            (Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) -
              Date.UTC(y.year, 0, 1)) /
            86_400_000;
          const lx = ((day / 366) * band).toFixed(1);
          if (isFailure(l)) failed += `M${lx},2V30`;
          else ok += `M${lx},6V26`;
          if (l.landings.landed > 0) landed += `M${lx},30V36`;
        }
        return (
          <m.li
            key={y.year}
            className={s.row}
            initial={{ opacity: reduce ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: reduce ? 0 : Math.min(i, 8) * 0.04 }}
          >
            <Link to={`/launches?year=${y.year}`} className={s.rowYear}>
              {y.year}
              <span className="visually-hidden">: {formatInt(y.flights)} flights</span>
            </Link>
            <svg width={band} height={38} className={s.band} aria-hidden="true" focusable="false">
              <line x1={0} x2={band} y1={16} y2={16} className={s.rowBase} />
              <path d={ok} className={s.tick} />
              <path d={failed} className={s.failTick} />
              <path d={landed} className={s.landTick} />
            </svg>
            <span className={s.rowCount} aria-hidden="true">
              {y.flights}
            </span>
          </m.li>
        );
      })}
    </ol>
  );
}
