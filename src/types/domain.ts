/**
 * Downrange domain model. The UI only ever sees these shapes; provider responses
 * (Launch Library 2) are normalized into them by `scripts/normalize.ts`.
 */

/** What happened on a flight. `upcoming` covers every not-yet-flown state (Go, TBC, TBD). */
export type Outcome = "success" | "failure" | "partial" | "upcoming";

/** How precisely the launch time is known. Drives whether a countdown can be shown. */
export type TimePrecision =
  "second" | "minute" | "hour" | "day" | "month" | "quarter" | "half" | "year" | "decade";

export type FamilyId = "falcon-1" | "falcon-9" | "falcon-heavy" | "starship";

export interface ImageRef {
  url: string;
  thumb: string;
  credit: string | null;
  license: string | null;
  /** True when the image shows the vehicle in general, not this specific flight. */
  generic: boolean;
}

/** Compact record used for lists, search, filters and statistics. */
export interface LaunchSummary {
  id: string;
  slug: string;
  /** 1-based ordinal among flown launches, in chronological order. Null for upcoming. */
  flight: number | null;
  name: string;
  mission: string;
  net: string;
  precision: TimePrecision;
  outcome: Outcome;
  /** Provider status label for upcoming flights ("Go for Launch", "To Be Determined"...). */
  status: string;
  vehicle: string;
  vehicleSlug: string;
  family: FamilyId;
  pad: string;
  site: string;
  orbit: string | null;
  missionType: string | null;
  crewed: boolean;
  /** Booster recovery on this flight. */
  landings: { attempted: number; landed: number };
  /** At least one flight-proven booster flew. */
  reused: boolean;
  thumb: string | null;
  patch: string | null;
}

export interface Stage {
  type: string;
  serial: string | null;
  /** How many times this booster had flown, including this flight. */
  boosterFlight: number | null;
  reused: boolean;
  /** Days since the booster's previous flight. */
  turnaroundDays: number | null;
  landing: {
    attempted: boolean;
    success: boolean | null;
    type: string | null;
    location: string | null;
    description: string | null;
  } | null;
}

export interface CrewMember {
  name: string;
  role: string | null;
  agency: string | null;
}

export interface Spacecraft {
  name: string;
  serial: string | null;
  destination: string | null;
  crew: CrewMember[];
}

export interface TimelineEvent {
  /** Seconds relative to T-0 (negative before liftoff). */
  t: number;
  label: string;
  description: string | null;
}

export interface Payload {
  name: string;
  type: string | null;
  massKg: number | null;
  operator: string | null;
  destination: string | null;
}

export interface LinkRef {
  title: string;
  url: string;
  source: string | null;
}

export interface LaunchDetail extends LaunchSummary {
  description: string | null;
  image: ImageRef | null;
  patches: { name: string; url: string }[];
  window: { start: string | null; end: string | null };
  probability: number | null;
  weather: string | null;
  failReason: string | null;
  location: { name: string; lat: number | null; lon: number | null; timezone: string | null };
  orbitName: string | null;
  stages: Stage[];
  spacecraft: Spacecraft[];
  payloads: Payload[];
  timeline: TimelineEvent[];
  videos: LinkRef[];
  links: LinkRef[];
  /** SpaceX launches in the calendar year up to and including this one (provider count). */
  yearCount: number | null;
  prev: { slug: string; name: string } | null;
  next: { slug: string; name: string } | null;
}

export interface VehicleRecord {
  flown: number;
  success: number;
  failure: number;
  partial: number;
  upcoming: number;
  landingsAttempted: number;
  landingsSucceeded: number;
  first: string | null;
  last: string | null;
}

export interface Rocket {
  slug: string;
  name: string;
  family: FamilyId;
  variant: string | null;
  active: boolean;
  description: string | null;
  /** Metres. */
  length: number | null;
  /** Metres. */
  diameter: number | null;
  /** Tonnes at liftoff. */
  launchMass: number | null;
  /** Kilograms to low Earth orbit. */
  leo: number | null;
  /** Kilograms to geostationary transfer orbit. */
  gto: number | null;
  /** Kilonewtons at liftoff. */
  thrust: number | null;
  stages: number | null;
  reusable: boolean;
  maidenFlight: string | null;
  wiki: string | null;
  image: ImageRef | null;
  record: VehicleRecord;
}

export interface SnapshotRecords {
  landings: { attempted: number; landed: number };
  /** Flights that used at least one flight-proven booster. */
  reflights: number;
  mostFlownBooster: { serial: string; flights: number; slug: string } | null;
  fastestTurnaround: { serial: string; days: number; slug: string } | null;
  crewedFlights: number;
  /** Distinct people launched (excludes the Starman mannequin). */
  humansFlown: number;
  /** Consecutive successful flights up to the most recent one. */
  successStreak: number;
  busiestYear: { year: number; flights: number } | null;
}

export interface SnapshotMeta {
  generatedAt: string;
  source: { name: string; url: string };
  counts: { launches: number; flown: number; upcoming: number; rockets: number };
  records: SnapshotRecords;
}
