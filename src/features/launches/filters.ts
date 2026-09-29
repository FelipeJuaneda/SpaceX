/**
 * Flight log filters. Every filter lives in the URL so any view of the log can be shared,
 * bookmarked, and retraced with the back button.
 */
import type { FamilyId, LaunchSummary } from "@/types/domain";

export type OutcomeFilter = "flown" | "success" | "failure" | "upcoming" | "all";
export type SortOrder = "newest" | "oldest";

export interface LogFilters {
  q: string;
  outcome: OutcomeFilter;
  family: FamilyId | "all";
  /** Exact vehicle configuration slug (set from a rocket page). */
  vehicle: string | null;
  year: number | null;
  crewed: boolean;
  sort: SortOrder;
}

const OUTCOMES: readonly OutcomeFilter[] = ["flown", "success", "failure", "upcoming", "all"];
const FAMILIES: readonly (FamilyId | "all")[] = [
  "all",
  "falcon-1",
  "falcon-9",
  "falcon-heavy",
  "starship",
];

export const FAMILY_LABEL: Record<FamilyId, string> = {
  "falcon-1": "Falcon 1",
  "falcon-9": "Falcon 9",
  "falcon-heavy": "Falcon Heavy",
  starship: "Starship",
};

/** Scheduled flights read soonest-first; flown ones most-recent-first. */
export const defaultSort = (outcome: OutcomeFilter): SortOrder =>
  outcome === "upcoming" ? "oldest" : "newest";

export const DEFAULT_FILTERS: LogFilters = {
  q: "",
  outcome: "flown",
  family: "all",
  vehicle: null,
  year: null,
  crewed: false,
  sort: "newest",
};

function oneOf<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

export function readFilters(params: URLSearchParams): LogFilters {
  const outcome = oneOf(params.get("outcome"), OUTCOMES, DEFAULT_FILTERS.outcome);
  const year = Number(params.get("year"));
  return {
    q: params.get("q") ?? "",
    outcome,
    family: oneOf(params.get("family"), FAMILIES, "all"),
    vehicle: params.get("vehicle") || null,
    year: Number.isInteger(year) && year >= 2006 && year <= 2100 ? year : null,
    crewed: params.get("crewed") === "1",
    sort: oneOf(params.get("sort"), ["newest", "oldest"] as const, defaultSort(outcome)),
  };
}

export function toSearchParams(f: LogFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q);
  if (f.outcome !== DEFAULT_FILTERS.outcome) p.set("outcome", f.outcome);
  if (f.family !== "all") p.set("family", f.family);
  if (f.vehicle) p.set("vehicle", f.vehicle);
  if (f.year !== null) p.set("year", String(f.year));
  if (f.crewed) p.set("crewed", "1");
  if (f.sort !== defaultSort(f.outcome)) p.set("sort", f.sort);
  return p;
}

export function isFiltered(f: LogFilters): boolean {
  return toSearchParams({ ...f, sort: defaultSort(f.outcome) }).toString() !== "";
}

const fold = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

function haystack(l: LaunchSummary): string {
  return fold(
    [
      l.name,
      l.mission,
      l.vehicle,
      l.site,
      l.pad,
      l.orbit,
      l.missionType,
      l.flight ? `#${l.flight}` : "",
    ]
      .filter(Boolean)
      .join(" "),
  );
}

const cache = new WeakMap<LaunchSummary, string>();

/** Every word of the query must appear somewhere in the flight's record. "#512" finds flight 512. */
export function matchesQuery(l: LaunchSummary, q: string): boolean {
  const words = fold(q).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  if (words.length === 1 && /^#?\d+$/.test(words[0] ?? "") && l.flight !== null) {
    if (`#${l.flight}` === `#${words[0]?.replace("#", "")}`) return true;
  }
  let text = cache.get(l);
  if (text === undefined) {
    text = haystack(l);
    cache.set(l, text);
  }
  return words.every((w) => text.includes(w));
}

function matchesOutcome(l: LaunchSummary, outcome: OutcomeFilter): boolean {
  switch (outcome) {
    case "all":
      return true;
    case "flown":
      return l.outcome !== "upcoming";
    case "failure":
      return l.outcome === "failure" || l.outcome === "partial";
    default:
      return l.outcome === outcome;
  }
}

export function applyFilters(launches: readonly LaunchSummary[], f: LogFilters): LaunchSummary[] {
  const result = launches.filter(
    (l) =>
      matchesOutcome(l, f.outcome) &&
      (f.family === "all" || l.family === f.family) &&
      (f.vehicle === null || l.vehicleSlug === f.vehicle) &&
      (f.year === null || l.net.startsWith(String(f.year))) &&
      (!f.crewed || l.crewed) &&
      matchesQuery(l, f.q),
  );
  // The snapshot is stored oldest-first.
  return f.sort === "newest" ? result.reverse() : result;
}

export function outcomeCounts(launches: readonly LaunchSummary[]): Record<OutcomeFilter, number> {
  const counts: Record<OutcomeFilter, number> = {
    flown: 0,
    success: 0,
    failure: 0,
    upcoming: 0,
    all: 0,
  };
  for (const l of launches) {
    counts.all += 1;
    if (l.outcome === "upcoming") counts.upcoming += 1;
    else {
      counts.flown += 1;
      if (l.outcome === "success") counts.success += 1;
      else counts.failure += 1;
    }
  }
  return counts;
}
