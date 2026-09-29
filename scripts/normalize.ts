import {
  familyOf,
  missionFromName,
  outcomeOf,
  parseDuration,
  precisionOf,
  slugify,
} from "../src/lib/ll2-mapping.ts";
import type {
  ImageRef,
  LaunchDetail,
  LaunchSummary,
  LinkRef,
  Rocket,
  SnapshotRecords,
} from "../src/types/domain.ts";
import type { LL2Config, LL2Image, LL2Launch } from "./ll2-types.ts";

function imageOf(image: LL2Image | null): ImageRef | null {
  if (!image?.image_url) return null;
  return {
    url: image.image_url,
    thumb: image.thumbnail_url ?? image.image_url,
    credit: image.credit?.trim() || null,
    license: image.license?.name && image.license.name !== "Unknown" ? image.license.name : null,
    generic: Boolean(image.name?.startsWith("[AUTO]")) || image.single_use === false,
  };
}

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function shortSite(locationName: string): string {
  return locationName.split(",")[0]?.trim() ?? locationName;
}

function missionName(launch: LL2Launch): string {
  return launch.mission?.name ?? missionFromName(launch.name);
}

/** Starman (Falcon Heavy demo, 2018) is listed as crew but is a mannequin. */
const NOT_A_PERSON = new Set(["Starman"]);

function crewOf(launch: LL2Launch) {
  return (launch.rocket.spacecraft_stage ?? []).flatMap((sc) => sc.launch_crew ?? []);
}

function summarize(launch: LL2Launch, flight: number | null): LaunchSummary {
  const outcome = outcomeOf(launch.status.abbrev);
  const config = launch.rocket.configuration;
  const stages = launch.rocket.launcher_stage ?? [];
  const patch = [...(launch.mission_patches ?? [])].sort((a, b) => b.priority - a.priority)[0];
  return {
    id: launch.id,
    slug: launch.slug,
    flight,
    name: launch.name,
    mission: missionName(launch),
    net: launch.net,
    precision: precisionOf(launch.net_precision?.abbrev, outcome),
    outcome,
    status: launch.status.name,
    vehicle: config.full_name,
    vehicleSlug: slugify(config.full_name),
    family: familyOf(config.full_name),
    pad: launch.pad.name,
    site: shortSite(launch.pad.location.name),
    orbit: launch.mission?.orbit?.abbrev ?? null,
    missionType: launch.mission?.type ?? null,
    crewed: crewOf(launch).some((c) => !NOT_A_PERSON.has(c.astronaut.name)),
    landings: {
      attempted: stages.filter((s) => s.landing?.attempt).length,
      landed: stages.filter((s) => s.landing?.attempt && s.landing.success).length,
    },
    reused: stages.some((s) => s.reused),
    thumb: launch.image?.thumbnail_url ?? launch.image?.image_url ?? null,
    patch: patch?.image_url ?? null,
  };
}

function linksOf(launch: LL2Launch): { videos: LinkRef[]; links: LinkRef[] } {
  const byPriority = <T extends { priority: number }>(a: T, b: T) => b.priority - a.priority;
  const seen = new Set<string>();
  const videos = [...(launch.vid_urls ?? [])]
    .sort(byPriority)
    .filter((v) => (seen.has(v.url) ? false : (seen.add(v.url), true)))
    .slice(0, 3)
    .map((v) => ({ title: v.title ?? "Webcast", url: v.url, source: v.publisher ?? v.source }));
  const links = [...(launch.info_urls ?? [])]
    .sort(byPriority)
    .slice(0, 4)
    .map((l) => ({ title: l.title ?? l.url, url: l.url, source: l.source }));
  if (launch.flightclub_url) {
    links.push({ title: "Trajectory simulation", url: launch.flightclub_url, source: "flightclub.io" });
  }
  return { videos, links };
}

function detail(launch: LL2Launch, summary: LaunchSummary): LaunchDetail {
  const { videos, links } = linksOf(launch);
  return {
    ...summary,
    description: launch.mission?.description?.trim() || null,
    image: imageOf(launch.image),
    patches: [...(launch.mission_patches ?? [])]
      .sort((a, b) => b.priority - a.priority)
      .map((p) => ({ name: p.name, url: p.image_url })),
    window: { start: launch.window_start, end: launch.window_end },
    probability: launch.probability ?? null,
    weather: launch.weather_concerns?.trim() || null,
    failReason: launch.failreason?.trim() || null,
    location: {
      name: launch.pad.location.name,
      lat: toNumber(launch.pad.latitude),
      lon: toNumber(launch.pad.longitude),
      timezone: launch.pad.location.timezone_name,
    },
    orbitName: launch.mission?.orbit?.name ?? null,
    stages: (launch.rocket.launcher_stage ?? []).map((s) => {
      const turnaround = parseDuration(s.turn_around_time);
      return {
        type: s.type,
        serial: s.launcher?.serial_number ?? null,
        boosterFlight: s.launcher_flight_number,
        reused: Boolean(s.reused),
        turnaroundDays: turnaround === null ? null : Math.round((turnaround / 86400) * 10) / 10,
        landing: s.landing
          ? {
              attempted: s.landing.attempt,
              success: s.landing.success,
              type: s.landing.type?.name ?? null,
              location: s.landing.landing_location?.abbrev || s.landing.landing_location?.name || null,
              description: s.landing.description?.trim() || null,
            }
          : null,
      };
    }),
    spacecraft: (launch.rocket.spacecraft_stage ?? []).map((sc) => ({
      name: sc.spacecraft?.name ?? "Spacecraft",
      serial: sc.spacecraft?.serial_number ?? null,
      destination: sc.destination,
      crew: (sc.launch_crew ?? []).map((c) => ({
        name: c.astronaut.name,
        role: c.role?.role ?? null,
        agency: c.astronaut.agency?.abbrev || c.astronaut.agency?.name || null,
      })),
    })),
    payloads: (launch.rocket.payloads ?? []).map((p) => ({
      name: p.payload.name,
      type: p.payload.type?.name ?? null,
      massKg: p.payload.mass,
      operator: p.payload.operator?.name ?? null,
      destination: p.destination,
    })),
    timeline: (launch.timeline ?? [])
      .map((e) => ({
        t: parseDuration(e.relative_time),
        label: e.type.abbrev,
        description: e.type.description?.trim() || null,
      }))
      .filter((e): e is { t: number; label: string; description: string | null } => e.t !== null)
      .sort((a, b) => a.t - b.t),
    videos,
    links,
    yearCount: launch.agency_launch_attempt_count_year ?? null,
    prev: null,
    next: null,
  };
}

function rocketOf(config: LL2Config, launches: LaunchSummary[]): Rocket {
  const own = launches.filter((l) => l.vehicle === config.full_name);
  const flown = own.filter((l) => l.outcome !== "upcoming");
  return {
    slug: slugify(config.full_name),
    name: config.full_name,
    family: familyOf(config.full_name),
    variant: config.variant || null,
    active: config.active,
    description: config.description?.trim() || null,
    length: config.length,
    diameter: config.diameter,
    launchMass: config.launch_mass,
    leo: config.leo_capacity,
    gto: config.gto_capacity,
    thrust: config.to_thrust,
    stages: config.max_stage,
    reusable: config.reusable,
    maidenFlight: config.maiden_flight,
    wiki: config.wiki_url,
    image: imageOf(config.image),
    record: {
      flown: flown.length,
      success: flown.filter((l) => l.outcome === "success").length,
      failure: flown.filter((l) => l.outcome === "failure").length,
      partial: flown.filter((l) => l.outcome === "partial").length,
      upcoming: own.length - flown.length,
      landingsAttempted: flown.reduce((n, l) => n + l.landings.attempted, 0),
      landingsSucceeded: flown.reduce((n, l) => n + l.landings.landed, 0),
      first: flown[0]?.net ?? null,
      last: flown.at(-1)?.net ?? null,
    },
  };
}

export interface Snapshot {
  index: LaunchSummary[];
  details: LaunchDetail[];
  rockets: Rocket[];
  records: SnapshotRecords;
}

/** Headline records, computed here so every figure the UI prints is traceable to the data. */
function recordsOf(details: LaunchDetail[]): SnapshotRecords {
  const flown = details.filter((d) => d.outcome !== "upcoming");

  let booster: SnapshotRecords["mostFlownBooster"] = null;
  let turnaround: SnapshotRecords["fastestTurnaround"] = null;
  for (const launch of flown) {
    for (const stage of launch.stages) {
      if (stage.serial && stage.boosterFlight && (!booster || stage.boosterFlight > booster.flights)) {
        booster = { serial: stage.serial, flights: stage.boosterFlight, slug: launch.slug };
      }
      if (stage.serial && stage.turnaroundDays && (!turnaround || stage.turnaroundDays < turnaround.days)) {
        turnaround = { serial: stage.serial, days: stage.turnaroundDays, slug: launch.slug };
      }
    }
  }

  const humans = new Set<string>();
  let crewedFlights = 0;
  for (const launch of flown) {
    if (!launch.crewed) continue;
    crewedFlights += 1;
    for (const sc of launch.spacecraft) for (const c of sc.crew) if (c.name !== "Starman") humans.add(c.name);
  }

  let streak = 0;
  for (let i = flown.length - 1; i >= 0 && flown[i]?.outcome === "success"; i--) streak += 1;

  const perYear = new Map<string, number>();
  for (const launch of flown) perYear.set(launch.net.slice(0, 4), (perYear.get(launch.net.slice(0, 4)) ?? 0) + 1);
  const [busiestYear, busiestCount] = [...perYear.entries()].sort((a, b) => b[1] - a[1])[0] ?? ["", 0];

  return {
    landings: {
      attempted: flown.reduce((n, l) => n + l.landings.attempted, 0),
      landed: flown.reduce((n, l) => n + l.landings.landed, 0),
    },
    reflights: flown.filter((l) => l.reused).length,
    mostFlownBooster: booster,
    fastestTurnaround: turnaround,
    crewedFlights,
    humansFlown: humans.size,
    successStreak: streak,
    busiestYear: busiestYear ? { year: Number(busiestYear), flights: busiestCount } : null,
  };
}

/** Turns raw LL2 launches (any order) into the Downrange snapshot. */
export function normalize(raw: LL2Launch[]): Snapshot {
  const sorted = [...raw].sort((a, b) => a.net.localeCompare(b.net));
  let flight = 0;
  const pairs = sorted.map((launch) => {
    const flown = outcomeOf(launch.status.abbrev) !== "upcoming";
    const summary = summarize(launch, flown ? ++flight : null);
    return { launch, summary };
  });
  const index = pairs.map((p) => p.summary);
  const details = pairs.map(({ launch, summary }, i) => {
    const d = detail(launch, summary);
    const prev = pairs[i - 1]?.summary;
    const next = pairs[i + 1]?.summary;
    d.prev = prev ? { slug: prev.slug, name: prev.mission } : null;
    d.next = next ? { slug: next.slug, name: next.mission } : null;
    return d;
  });

  const configs = new Map<number, LL2Config>();
  for (const launch of sorted) configs.set(launch.rocket.configuration.id, launch.rocket.configuration);
  const rockets = [...configs.values()]
    .map((c) => rocketOf(c, index))
    .sort((a, b) => (a.maidenFlight ?? "9999").localeCompare(b.maidenFlight ?? "9999"));

  return { index, details, rockets, records: recordsOf(details) };
}
