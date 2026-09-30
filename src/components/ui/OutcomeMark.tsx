import type { Outcome } from "@/types/domain";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n/useI18n";
import s from "./OutcomeMark.module.css";

/**
 * The pen mark for a flight outcome. Shape carries the meaning; colour only reinforces it
 * (red is reserved for failures), so the mark reads in greyscale and for colour-blind visitors.
 */
export function OutcomeGlyph({ outcome, className }: { outcome: Outcome; className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      aria-hidden="true"
      focusable="false"
      className={cn(s.glyph, s[outcome], className)}
    >
      {outcome === "success" && <rect x="1.5" y="1.5" width="9" height="9" />}
      {outcome === "failure" && <path d="M2 2L10 10M10 2L2 10" />}
      {outcome === "partial" && (
        <>
          <rect x="1.5" y="1.5" width="9" height="9" className={s.outline} />
          <path d="M1.5 6H10.5V10.5H1.5Z" />
        </>
      )}
      {outcome === "upcoming" && <rect x="1.5" y="1.5" width="9" height="9" className={s.dashed} />}
    </svg>
  );
}

interface Props {
  outcome: Outcome;
  /** Override the default label ("Success", "Scheduled"...). */
  label?: string;
  /** Glyph only; the label stays available to assistive technology. */
  compact?: boolean;
  className?: string;
}

export function OutcomeMark({ outcome, label, compact, className }: Props) {
  const { m } = useI18n();
  label ??= m.outcome[outcome];
  return (
    <span className={cn(s.mark, s[`text-${outcome}`], className)}>
      <OutcomeGlyph outcome={outcome} />
      <span className={compact ? "visually-hidden" : s.label}>{label}</span>
    </span>
  );
}
