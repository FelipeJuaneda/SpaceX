import type { Rocket } from "@/types/domain";
import { cn } from "@/lib/cn";
import { silhouetteShape } from "./silhouette-geometry";
import s from "./ScaleChart.module.css";

interface Props {
  rocket: Rocket;
  /** Pixels per metre. */
  ppm: number;
  className?: string;
}

export function Silhouette({ rocket, ppm, className }: Props) {
  const L = rocket.length ?? 0;
  if (!L) return null;
  const shape = silhouetteShape(rocket);
  return (
    <svg
      width={shape.width * ppm}
      height={L * ppm}
      viewBox={`0 0 ${shape.width} ${L}`}
      className={cn(s.silhouette, className)}
      aria-hidden="true"
      focusable="false"
    >
      {shape.parts}
    </svg>
  );
}
