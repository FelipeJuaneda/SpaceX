import { useState } from "react";
import type { ImageRef } from "@/types/domain";
import { cn } from "@/lib/cn";
import s from "./Photo.module.css";

interface Props {
  image: ImageRef | null;
  alt: string;
  /** CSS aspect-ratio of the frame, e.g. "3 / 2". Reserving it prevents layout shift. */
  ratio?: string;
  /** Load eagerly with high priority (above-the-fold hero). */
  priority?: boolean;
  caption?: boolean;
  className?: string;
}

/**
 * A photograph printed on the chart paper: greyscale ink by default, full colour on hover or focus.
 * The provider thumbnail stands in, blurred, until the full image arrives.
 */
export function Photo({ image, alt, ratio = "3 / 2", priority, caption = true, className }: Props) {
  const [state, setState] = useState<"loading" | "loaded" | "error">(image ? "loading" : "error");

  return (
    <figure className={cn(s.figure, className)}>
      <div className={s.frame} style={{ aspectRatio: ratio }} data-state={state}>
        {image && state !== "error" && (
          <>
            {image.thumb !== image.url && (
              <img src={image.thumb} alt="" aria-hidden="true" className={s.placeholder} decoding="async" />
            )}
            <img
              src={image.url}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              onLoad={() => setState("loaded")}
              onError={() => setState("error")}
              className={s.img}
            />
          </>
        )}
        {state === "error" && (
          <div className={s.missing}>
            <span className="legend">No photograph on file</span>
          </div>
        )}
      </div>
      {caption && image && state !== "error" && (
        <figcaption className={s.caption}>
          {image.generic && <span>Vehicle photograph, not from this flight. </span>}
          <span>
            {image.credit ? `Credit: ${image.credit}` : "Credit not recorded"}
            {image.license && ` · ${image.license}`}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
