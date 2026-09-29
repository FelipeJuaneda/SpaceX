import { Link } from "react-router";
import type { Rocket } from "@/types/domain";
import { cn } from "@/lib/cn";
import { formatLength } from "@/lib/format";
import { Silhouette } from "./Silhouette";
import { silhouetteWidth } from "./silhouette-geometry";
import s from "./ScaleChart.module.css";

/**
 * 4 px per metre, so ten metres is exactly one 40 px major division of the chart paper:
 * the page grid is the measuring scale.
 */
export const PPM = 4;

interface Props {
  rockets: Rocket[];
  /** Slug drawn in cobalt (the vehicle the page is about). */
  highlight?: string;
  className?: string;
}

export function ScaleChart({ rockets, highlight, className }: Props) {
  const drawn = rockets.filter((r) => r.length);
  const top = Math.ceil(Math.max(...drawn.map((r) => r.length ?? 0)) / 10) * 10;
  const marks = Array.from({ length: top / 10 + 1 }, (_, i) => i * 10);

  return (
    <div className={cn(s.scroller, className)}>
      <div className={s.chart} style={{ height: top * PPM }}>
        <ul className={s.axis} aria-hidden="true">
          {marks.map((v) => (
            <li key={v} style={{ bottom: v * PPM }}>
              {v} m
            </li>
          ))}
        </ul>
        <ol className={s.vehicles}>
          {drawn.map((r) => (
            <li
              key={r.slug}
              className={cn(s.vehicle, r.slug === highlight && s.current)}
              style={{ minWidth: Math.max(76, silhouetteWidth(r) * PPM + 24) }}
            >
              <Link to={`/rockets/${r.slug}`} className={s.link}>
                <Silhouette rocket={r} ppm={PPM} />
                <span className={s.label}>
                  <span className={s.name}>{r.name}</span>
                  <span className={s.height}>{formatLength(r.length)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
