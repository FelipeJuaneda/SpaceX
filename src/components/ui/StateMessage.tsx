import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import s from "./StateMessage.module.css";

interface Props {
  variant: "empty" | "error";
  title: string;
  body?: ReactNode;
  action?: ReactNode;
  headingLevel?: 1 | 2 | 3;
  className?: string;
}

/**
 * Empty and error states, drawn as a trace: a flat line when there is nothing to plot,
 * a line that breaks off when the recorder could not draw.
 */
export function StateMessage({ variant, title, body, action, headingLevel = 2, className }: Props) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section
      className={cn(s.state, s[variant], className)}
      role={variant === "error" ? "alert" : "status"}
    >
      <svg className={s.trace} viewBox="0 0 240 32" aria-hidden="true" focusable="false">
        {variant === "empty" ? (
          <path d="M0 16H240" />
        ) : (
          <>
            <path d="M0 16H96L104 16L110 4L117 28L122 12" />
            <path d="M150 16H240" className={s.after} />
          </>
        )}
      </svg>
      <Heading className={s.title}>{title}</Heading>
      {body && <div className={s.body}>{body}</div>}
      {action && <div className={s.action}>{action}</div>}
    </section>
  );
}
