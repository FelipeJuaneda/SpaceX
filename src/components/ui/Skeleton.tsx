import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import s from "./Skeleton.module.css";

interface Props {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  className?: string;
  style?: CSSProperties;
}

/** A placeholder block shaped like the content it stands in for. Decorative to assistive tech. */
export function Skeleton({ width, height = "1em", className, style }: Props) {
  return (
    <span
      aria-hidden="true"
      className={cn(s.bone, className)}
      style={{ width, height, ...style }}
    />
  );
}

/** Announces loading once to screen readers while skeletons render. */
export function LoadingNote({ children }: { children: string }) {
  return (
    <p role="status" className="visually-hidden">
      {children}
    </p>
  );
}
