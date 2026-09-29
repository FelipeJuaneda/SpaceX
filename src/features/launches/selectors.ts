/** Figures derived from the launch index. Every number the UI prints comes from here or from meta.records. */
import type { LaunchSummary } from "@/types/domain";

export const isFlown = (l: LaunchSummary) => l.outcome !== "upcoming";
export const isFailure = (l: LaunchSummary) => l.outcome === "failure" || l.outcome === "partial";
export const time = (l: LaunchSummary) => Date.parse(l.net);

/** Next flight that has not yet lifted off (allowing an hour past T-0 for late status updates). */
export function nextScheduled(launches: readonly LaunchSummary[], now: number): LaunchSummary | undefined {
  return launches.find((l) => l.outcome === "upcoming" && time(l) >= now - 3_600_000);
}

export function between(launches: readonly LaunchSummary[], from: number, to: number): LaunchSummary[] {
  return launches.filter((l) => {
    const t = time(l);
    return t >= from && t <= to;
  });
}

export interface YearStat {
  year: number;
  flights: number;
  failures: number;
  landed: number;
  attempted: number;
  reflights: number;
}

/** One row per calendar year from the first flight to the latest, including empty years. */
export function yearStats(launches: readonly LaunchSummary[]): YearStat[] {
  const done = launches.filter(isFlown);
  if (done.length === 0) return [];
  const first = new Date(done[0]!.net).getUTCFullYear();
  const last = new Date(done.at(-1)!.net).getUTCFullYear();
  const rows = new Map<number, YearStat>();
  for (let y = first; y <= last; y++) {
    rows.set(y, { year: y, flights: 0, failures: 0, landed: 0, attempted: 0, reflights: 0 });
  }
  for (const l of done) {
    const row = rows.get(new Date(l.net).getUTCFullYear())!;
    row.flights += 1;
    if (isFailure(l)) row.failures += 1;
    row.landed += l.landings.landed;
    row.attempted += l.landings.attempted;
    if (l.reused) row.reflights += 1;
  }
  return [...rows.values()];
}

export interface CumulativePoint {
  t: number;
  flights: number;
  landed: number;
  reflights: number;
}

export function cumulative(launches: readonly LaunchSummary[]): CumulativePoint[] {
  let flights = 0;
  let landed = 0;
  let reflights = 0;
  return launches.filter(isFlown).map((l) => {
    flights += 1;
    landed += l.landings.landed;
    if (l.reused) reflights += 1;
    return { t: time(l), flights, landed, reflights };
  });
}

/** Milestones of reuse, found in the record rather than hard-coded. */
export function reuseFirsts(launches: readonly LaunchSummary[]) {
  const done = launches.filter(isFlown);
  return {
    firstLanding: done.find((l) => l.landings.landed > 0),
    firstReflight: done.find((l) => l.reused),
  };
}

/** Flights in the trailing 30 days, sampled weekly: the cadence trace. */
export function cadence(launches: readonly LaunchSummary[], until: number): { t: number; n: number }[] {
  const times = launches.filter(isFlown).map(time);
  if (times.length === 0) return [];
  const WEEK = 7 * 86_400_000;
  const WINDOW = 30 * 86_400_000;
  const points: { t: number; n: number }[] = [];
  let lo = 0;
  let hi = 0;
  for (let t = times[0]!; t <= until; t += WEEK) {
    while (hi < times.length && times[hi]! <= t) hi++;
    while (lo < hi && times[lo]! < t - WINDOW) lo++;
    points.push({ t, n: hi - lo });
  }
  return points;
}

export function groupByYear(launches: readonly LaunchSummary[]): { year: number; launches: LaunchSummary[] }[] {
  const groups: { year: number; launches: LaunchSummary[] }[] = [];
  for (const l of launches) {
    const year = new Date(l.net).getUTCFullYear();
    const last = groups.at(-1);
    if (last && last.year === year) last.launches.push(l);
    else groups.push({ year, launches: [l] });
  }
  return groups;
}
