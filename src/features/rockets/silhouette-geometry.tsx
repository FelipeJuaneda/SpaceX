import type { ReactNode } from "react";
import type { Rocket } from "@/types/domain";
import s from "./ScaleChart.module.css";

/**
 * Schematic silhouettes computed from each vehicle's recorded length and diameter.
 * Proportions of stages, fairings and fins are generic per family; the overall size is exact.
 * Units inside the SVG are metres.
 */

function ogive(cx: number, top: number, w: number, h: number): string {
  const l = cx - w / 2;
  const r = cx + w / 2;
  return `M${l},${top + h}L${l},${top + h * 0.55}C${l},${top + h * 0.18} ${cx - w * 0.14},${top} ${cx},${top}C${cx + w * 0.14},${top} ${r},${top + h * 0.18} ${r},${top + h * 0.55}L${r},${top + h}Z`;
}

export interface Shape {
  width: number;
  parts: ReactNode;
}

function falcon(rocket: Rocket, L: number, heavy: boolean): Shape {
  const d = rocket.family === "falcon-1" ? 1.7 : 3.66;
  const recoverable = rocket.reusable || /Full Thrust|Block/.test(rocket.name) || heavy;
  const fairingW = rocket.family === "falcon-1" || rocket.name.endsWith("v1.0") ? d : 5.2;
  const legs = recoverable ? 1.9 : 0;
  const sideOffset = heavy ? d + 0.3 : 0;
  const width = Math.max(fairingW, d + 2 * sideOffset + 2 * legs);
  const cx = width / 2;
  const fh = rocket.family === "falcon-1" ? L * 0.2 : 13.1;
  const taper = fairingW > d ? 1.4 : 0;
  const s1 = L * 0.6;
  const ib = L * 0.065;
  const s2Top = fh + taper;
  const s2H = L - s1 - ib - s2Top;

  const booster = (bx: number, key: string, nose: boolean) => (
    <g key={key}>
      {nose && <path d={ogive(bx, L - s1 - 7, d, 7)} className={s.hull} />}
      <rect x={bx - d / 2} y={L - s1} width={d} height={s1} className={s.hull} />
      {recoverable && (
        <>
          <rect
            x={bx - d / 2 - 0.9}
            y={L - s1 + (nose ? 0.4 : -ib + 0.6)}
            width={0.9}
            height={1.4}
            className={s.part}
          />
          <rect
            x={bx + d / 2}
            y={L - s1 + (nose ? 0.4 : -ib + 0.6)}
            width={0.9}
            height={1.4}
            className={s.part}
          />
          <path
            d={`M${bx - d / 2},${L - 11}L${bx - d / 2 - legs},${L}M${bx + d / 2},${L - 11}L${bx + d / 2 + legs},${L}`}
            className={s.line}
          />
        </>
      )}
    </g>
  );

  return {
    width,
    parts: (
      <>
        {heavy && booster(cx - sideOffset, "left", true)}
        {heavy && booster(cx + sideOffset, "right", true)}
        <path d={ogive(cx, 0, fairingW, fh)} className={s.hull} />
        {taper > 0 && (
          <path
            d={`M${cx - fairingW / 2},${fh}L${cx + fairingW / 2},${fh}L${cx + d / 2},${fh + taper}L${cx - d / 2},${fh + taper}Z`}
            className={s.hull}
          />
        )}
        <rect x={cx - d / 2} y={s2Top} width={d} height={s2H} className={s.hull} />
        <rect x={cx - d / 2} y={L - s1 - ib} width={d} height={ib} className={s.band} />
        {booster(cx, "core", false)}
      </>
    ),
  };
}

function starship(rocket: Rocket, L: number): Shape {
  const d = 9;
  const flap = 2.4;
  const width = d + 2 * flap;
  const cx = width / 2;
  const prototype = rocket.name === "Starship Prototype";
  const booster = prototype ? 0 : L * 0.57;
  const ring = prototype ? 0 : 1.8;
  const ship = L - booster - ring;
  const nose = ship * (prototype ? 0.34 : 0.3);
  const shipBottom = ship;

  return {
    width,
    parts: (
      <>
        <path d={ogive(cx, 0, d, nose)} className={s.hull} />
        <rect x={cx - d / 2} y={nose} width={d} height={ship - nose} className={s.hull} />
        <path
          d={`M${cx - d / 2},${nose * 0.42}L${cx - d / 2 - 1.5},${nose * 0.62}L${cx - d / 2 - 1.5},${nose * 0.88}L${cx - d / 2},${nose * 0.92}Z M${cx + d / 2},${nose * 0.42}L${cx + d / 2 + 1.5},${nose * 0.62}L${cx + d / 2 + 1.5},${nose * 0.88}L${cx + d / 2},${nose * 0.92}Z`}
          className={s.part}
        />
        <path
          d={`M${cx - d / 2},${shipBottom - 9}L${cx - d / 2 - flap},${shipBottom - 5}L${cx - d / 2 - flap},${shipBottom - 0.5}L${cx - d / 2},${shipBottom - 0.5}Z M${cx + d / 2},${shipBottom - 9}L${cx + d / 2 + flap},${shipBottom - 5}L${cx + d / 2 + flap},${shipBottom - 0.5}L${cx + d / 2},${shipBottom - 0.5}Z`}
          className={s.part}
        />
        {prototype ? (
          <path
            d={`M${cx - d / 2 + 1},${L - 3}L${cx - d / 2 - 0.5},${L}M${cx + d / 2 - 1},${L - 3}L${cx + d / 2 + 0.5},${L}`}
            className={s.line}
          />
        ) : (
          <>
            <rect x={cx - d / 2} y={ship} width={d} height={ring} className={s.band} />
            <rect x={cx - d / 2} y={ship + ring} width={d} height={booster} className={s.hull} />
            <rect
              x={cx - d / 2 - 1.6}
              y={ship + ring + 1}
              width={1.6}
              height={3.2}
              className={s.part}
            />
            <rect x={cx + d / 2} y={ship + ring + 1} width={1.6} height={3.2} className={s.part} />
          </>
        )}
      </>
    ),
  };
}

/** The drawing for a vehicle, in metres. */
export function silhouetteShape(rocket: Rocket): Shape {
  const L = rocket.length ?? 0;
  return rocket.family === "starship"
    ? starship(rocket, L)
    : falcon(rocket, L, rocket.family === "falcon-heavy");
}

export function silhouetteWidth(rocket: Rocket): number {
  return silhouetteShape(rocket).width;
}
