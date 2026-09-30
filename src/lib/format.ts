import { getLocale, type Locale } from "@/i18n/store";
import type { TimePrecision } from "@/types/domain";

/** Date conventions per interface language (day-month order, 24-hour clock in both). */
const DATE_TAG: Record<Locale, string> = { en: "en-GB", es: "es-AR" };
const NUMBER_TAG: Record<Locale, string> = { en: "en-US", es: "es-AR" };

const dateCache = new Map<string, Intl.DateTimeFormat>();
const numberCache = new Map<string, Intl.NumberFormat>();

function dates(name: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const locale = getLocale();
  const key = `${locale}:${name}`;
  let fmt = dateCache.get(key);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(DATE_TAG[locale], options);
    dateCache.set(key, fmt);
  }
  return fmt;
}

function numbers(name: string, options: Intl.NumberFormatOptions = {}): Intl.NumberFormat {
  const locale = getLocale();
  const key = `${locale}:${name}`;
  let fmt = numberCache.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(NUMBER_TAG[locale], options);
    numberCache.set(key, fmt);
  }
  return fmt;
}

const DAY: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
};
const MONTH: Intl.DateTimeFormatOptions = { month: "long", year: "numeric", timeZone: "UTC" };
const MONTH_SHORT: Intl.DateTimeFormatOptions = { month: "short", timeZone: "UTC" };
const TIME: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
};
/** In the visitor's own time zone. */
const LOCAL: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZoneName: "short",
};

/** True when the launch time is known well enough to count down to it. */
export function isPrecise(precision: TimePrecision): boolean {
  return precision === "second" || precision === "minute" || precision === "hour";
}

/**
 * A launch date written with no more precision than the record holds:
 * "30 May 2020", "October 2026", "Q4 2026", "2027" (Spanish: "T4 2026", "S2 2026").
 */
export function formatNet(iso: string, precision: TimePrecision): string {
  const date = new Date(iso);
  const year = date.getUTCFullYear();
  const es = getLocale() === "es";
  switch (precision) {
    case "month":
      return dates("month", MONTH).format(date);
    case "quarter":
      return `${es ? "T" : "Q"}${Math.floor(date.getUTCMonth() / 3) + 1} ${year}`;
    case "half":
      return `${es ? "S" : "H"}${date.getUTCMonth() < 6 ? 1 : 2} ${year}`;
    case "year":
      return String(year);
    case "decade":
      return es ? `década de ${Math.floor(year / 10) * 10}` : `${Math.floor(year / 10) * 10}s`;
    default:
      return dates("day", DAY).format(date);
  }
}

/** Machine-style reading: "2020-05-30 19:22 UTC" (time only when precise). */
export function formatStamp(iso: string, precision: TimePrecision = "minute"): string {
  if (!isPrecise(precision)) return formatNet(iso, precision);
  return `${iso.slice(0, 10)} ${dates("time", TIME).format(new Date(iso))} UTC`;
}

/** The same instant in the visitor's own time zone. */
export function formatLocal(iso: string): string {
  return dates("local", LOCAL).format(new Date(iso));
}

/** Short month name for chart axes: "Aug" / "ago". */
export function formatMonthShort(ms: number): string {
  return dates("monthShort", MONTH_SHORT).format(ms).replace(".", "");
}

export function formatInt(n: number): string {
  return numbers("int").format(n);
}

export function formatDecimal(n: number): string {
  return numbers("decimal", { maximumFractionDigits: 1 }).format(n);
}

export function formatPercent(part: number, whole: number): string {
  if (whole === 0) return "—";
  return `${formatDecimal((part / whole) * 100)}%`;
}

export function formatMass(kg: number | null): string {
  if (kg === null) return "—";
  return kg >= 10_000 ? `${formatDecimal(kg / 1000)} t` : `${formatInt(kg)} kg`;
}

export function formatLength(m: number | null): string {
  return m === null ? "—" : `${formatDecimal(m)} m`;
}

/** "37th" in English, "37.º" in Spanish. */
export function ordinal(n: number): string {
  if (getLocale() === "es") return `${n}.º`;
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
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
