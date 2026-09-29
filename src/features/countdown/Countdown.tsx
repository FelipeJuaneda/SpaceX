import type { TimePrecision } from "@/types/domain";
import { useNow } from "@/hooks/useNow";
import { cn } from "@/lib/cn";
import { countdownParts, formatNet, isPrecise } from "@/lib/format";
import s from "./Countdown.module.css";

interface Props {
  net: string;
  precision: TimePrecision;
  className?: string;
}

function spoken(c: ReturnType<typeof countdownParts>): string {
  const parts = [
    c.days ? `${c.days} days` : "",
    `${Number(c.hours)} hours`,
    `${Number(c.minutes)} minutes`,
  ].filter(Boolean);
  return c.sign === "-" ? `Liftoff in ${parts.join(", ")}` : `Lifted off ${parts.join(", ")} ago`;
}

/**
 * T-minus clock set in condensed chart numerals. When the record only knows the month or
 * quarter, it prints "NET" and that date instead of counting down to a fake second.
 */
export function Countdown({ net, precision, className }: Props) {
  const precise = isPrecise(precision);
  const now = useNow(1000, precise);

  if (!precise) {
    return (
      <p className={cn(s.coarse, className)}>
        <span className={s.net}>No earlier than</span>
        <span className={s.coarseValue}>{formatNet(net, precision)}</span>
      </p>
    );
  }

  const c = countdownParts(Date.parse(net), now);
  const units: [string, string][] = [
    ...(c.days > 0 ? ([[String(c.days), "days"]] as [string, string][]) : []),
    [c.hours, "hrs"],
    [c.minutes, "min"],
    [c.seconds, "sec"],
  ];

  return (
    <div className={cn(s.countdown, className)} role="timer" aria-label={spoken(c)}>
      <span className={s.t} aria-hidden="true">
        T{c.sign === "-" ? "−" : "+"}
      </span>
      {units.map(([value, unit], i) => (
        <span key={unit} className={s.group} aria-hidden="true">
          {i > 0 && (unit === "hrs" && c.days > 0 ? <span className={s.gap} /> : <span className={s.sep}>:</span>)}
          <span className={s.cell}>
            <span className={s.value}>{value}</span>
            <span className={s.unit}>{unit}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
