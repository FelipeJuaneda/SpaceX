/**
 * Pure mapping helpers from Launch Library 2 vocabulary to the Downrange domain.
 * Shared by the sync script (Node) and the live next-launch request (browser),
 * so it must stay free of runtime imports.
 */
import type { FamilyId, Outcome, TimePrecision } from "../types/domain.ts";

const PRECISION: Record<string, TimePrecision> = {
  SEC: "second",
  MIN: "minute",
  HR: "hour",
  DAY: "day",
  M: "month",
  Q1: "quarter",
  Q2: "quarter",
  Q3: "quarter",
  Q4: "quarter",
  H1: "half",
  H2: "half",
  Y: "year",
  FY: "year",
  DEC: "decade",
};

export function precisionOf(abbrev: string | null | undefined, outcome: Outcome): TimePrecision {
  const known = abbrev ? PRECISION[abbrev] : undefined;
  if (known) return known;
  // Early flights carry no precision but were logged to the minute.
  return outcome === "upcoming" ? "month" : "minute";
}

export function outcomeOf(statusAbbrev: string): Outcome {
  switch (statusAbbrev) {
    case "Success":
      return "success";
    case "Failure":
      return "failure";
    case "Partial Failure":
      return "partial";
    default:
      return "upcoming";
  }
}

export function familyOf(configName: string): FamilyId {
  if (configName === "Falcon 1") return "falcon-1";
  if (configName === "Falcon Heavy") return "falcon-heavy";
  if (configName.startsWith("Starship")) return "starship";
  return "falcon-9";
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Parses ISO-8601 durations such as `-PT53M`, `P0D`, `PT1H1M57S`, `P3DT4H` into seconds. */
export function parseDuration(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^(-)?P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(value);
  if (!match) return null;
  const [, sign, d, h, m, s] = match;
  const total =
    Number(d ?? 0) * 86400 + Number(h ?? 0) * 3600 + Number(m ?? 0) * 60 + Number(s ?? 0);
  return sign ? -total : total;
}

/** The mission part of an LL2 launch name: "Falcon 9 Block 5 | Crew-13" → "Crew-13". */
export function missionFromName(name: string): string {
  const parts = name.split(" | ");
  return parts.length > 1 ? parts.slice(1).join(" | ") : name;
}
