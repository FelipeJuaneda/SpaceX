import { OutcomeGlyph } from "@/components/ui/OutcomeMark";
import { cn } from "@/lib/cn";
import s from "./PenLegend.module.css";

/** Key to the pen inks, printed like the legend strip on recorder paper. */
export function PenLegend({ className }: { className?: string }) {
  return (
    <ul aria-label="Chart key" className={cn(s.legend, className)}>
      <li>
        <OutcomeGlyph outcome="success" />
        Flight
      </li>
      <li>
        <OutcomeGlyph outcome="failure" />
        Failure
      </li>
      <li>
        <LandingGlyph landed />
        Booster landed
      </li>
      <li>
        <OutcomeGlyph outcome="upcoming" />
        Scheduled
      </li>
    </ul>
  );
}

/** Cobalt pen: a filled dot for a recovered booster, a ring for a lost one. */
export function LandingGlyph({ landed, className }: { landed: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false" className={cn(s.landing, className)}>
      <circle cx="6" cy="6" r={landed ? 4.5 : 4} className={landed ? s.landed : s.lost} />
    </svg>
  );
}
