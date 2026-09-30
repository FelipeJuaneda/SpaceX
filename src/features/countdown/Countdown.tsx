import type { TimePrecision } from "@/types/domain";
import { useNow } from "@/hooks/useNow";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/cn";
import { countdownParts, formatNet, isPrecise } from "@/lib/format";
import s from "./Countdown.module.css";

interface Props {
  net: string;
  precision: TimePrecision;
  className?: string;
}

type Unit = "days" | "hrs" | "min" | "sec";

/**
 * T-minus clock set in condensed chart numerals. When the record only knows the month or
 * quarter, it prints "No earlier than" and that date instead of counting down to a fake second.
 */
export function Countdown({ net, precision, className }: Props) {
  const { m } = useI18n();
  const precise = isPrecise(precision);
  const now = useNow(1000, precise);

  if (!precise) {
    return (
      <p className={cn(s.coarse, className)}>
        <span className={s.net}>{m.countdown.net}</span>
        <span className={s.coarseValue}>{formatNet(net, precision)}</span>
      </p>
    );
  }

  const c = countdownParts(Date.parse(net), now);
  const units: [string, Unit][] = [
    ...(c.days > 0 ? ([[String(c.days), "days"]] as [string, Unit][]) : []),
    [c.hours, "hrs"],
    [c.minutes, "min"],
    [c.seconds, "sec"],
  ];
  const spoken = (c.sign === "-" ? m.countdown.liftoffIn : m.countdown.liftedOff)(
    c.days,
    Number(c.hours),
    Number(c.minutes),
  );

  return (
    <div className={cn(s.countdown, className)} role="timer" aria-label={spoken}>
      <span className={s.t} aria-hidden="true">
        T{c.sign === "-" ? "−" : "+"}
      </span>
      {units.map(([value, unit], i) => (
        <span key={unit} className={s.group} aria-hidden="true">
          {i > 0 &&
            (unit === "hrs" && c.days > 0 ? (
              <span className={s.gap} />
            ) : (
              <span className={s.sep}>:</span>
            ))}
          <span className={s.cell}>
            <span className={s.value}>{value}</span>
            <span className={s.unit}>{m.countdown[unit]}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
