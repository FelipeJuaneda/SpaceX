import { cn } from "@/lib/cn";
import s from "./Logotype.module.css";

/** The wordmark: set wide, underlined by one pen trace that spikes once. */
export function Logotype({ className }: { className?: string }) {
  return (
    <span className={cn(s.logo, className)}>
      <span className={s.word}>Downrange</span>
      <svg
        className={s.trace}
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0 9H138L142 9L146 2L151 11L155 5L158 9H200" />
      </svg>
    </span>
  );
}
