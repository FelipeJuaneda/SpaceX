import type { Outcome, TimePrecision } from "@/types/domain";

const LOCALE = "en-GB";

const dayFmt = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const monthFmt = new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric", timeZone: "UTC" });
const timeFmt = new Intl.DateTimeFormat(LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
});
// English like the rest of the interface, in the visitor's own time zone.
const localFmt = new Intl.DateTimeFormat(LOCALE, {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});
const intFmt = new Intl.NumberFormat("en-US");
const oneDecimal = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

/** True when the launch time is known well enough to count down to it. */
export function isPrecise(precision: TimePrecision): boolean {
  return precision === "second" || precision === "minute" || precision === "hour";
}

/**
 * A launch date written with no more precision than the record holds:
 * "30 May 2020", "October 2026", "Q4 2026", "2027".
 */
export function formatNet(iso: string, precision: TimePrecision): string {
  const date = new Date(iso);
  const year = date.getUTCFullYear();
  switch (precision) {
    case "month":
      return monthFmt.format(date);
    case "quarter":
      return `Q${Math.floor(date.getUTCMonth() / 3) + 1} ${year}`;
    case "half":
      return `H${date.getUTCMonth() < 6 ? 1 : 2} ${year}`;
    case "year":
      return String(year);
    case "decade":
      return `${Math.floor(year / 10) * 10}s`;
    default:
      return dayFmt.format(date);
  }
}

/** Machine-style reading: "2020-05-30 19:22 UTC" (time only when precise). */
export function formatStamp(iso: string, precision: TimePrecision = "minute"): string {
  const date = new Date(iso);
  const day = iso.slice(0, 10);
  if (!isPrecise(precision)) return formatNet(iso, precision);
  return `${day} ${timeFmt.format(date)} UTC`;
}

/** The same instant in the visitor's own time zone. */
export function formatLocal(iso: string): string {
  return localFmt.format(new Date(iso));
}

export function formatInt(n: number): string {
  return intFmt.format(n);
}

export function formatDecimal(n: number): string {
  return oneDecimal.format(n);
}

export function formatPercent(part: number, whole: number): string {
  if (whole === 0) return "—";
  return `${oneDecimal.format((part / whole) * 100)}%`;
}

export function formatMass(kg: number | null): string {
  if (kg === null) return "—";
  return kg >= 10_000 ? `${intFmt.format(Math.round(kg / 100) / 10)} t` : `${intFmt.format(kg)} kg`;
}

export function formatLength(m: number | null): string {
  return m === null ? "—" : `${oneDecimal.format(m)} m`;
}

export interface Countdown {
  /** "−" before T-0, "+" after. */
  sign: "-" | "+";
  days: number;
  hours: string;
  minutes: string;
  seconds: string;
}

export function countdownParts(targetMs: number, nowMs: number): Countdown {
  const diff = targetMs - nowMs;
  const total = Math.floor(Math.abs(diff) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    sign: diff >= 0 ? "-" : "+",
    days: Math.floor(total / 86400),
    hours: pad(Math.floor((total % 86400) / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60),
  };
}

/** Offset from T-0 as the countdown net reads it: "T−00:38:00", "T+00:08:23", "T+1:01:57". */
export function formatOffset(seconds: number): string {
  const sign = seconds < 0 ? "−" : "+";
  const abs = Math.abs(seconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = Math.floor(abs % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `T${sign}${pad(h)}:${pad(m)}:${pad(s)}`;
}

export const OUTCOME_LABEL: Record<Outcome, string> = {
  success: "Success",
  failure: "Failure",
  partial: "Partial failure",
  upcoming: "Scheduled",
};

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${formatInt(n)} ${n === 1 ? one : many}`;
}
