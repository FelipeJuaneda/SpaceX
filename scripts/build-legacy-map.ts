/**
 * One-off: maps ids from the retired SpaceX API (v4/v5) to Launch Library 2 slugs so
 * old `/launcher/:id` links and favourites saved by the previous version keep working.
 * The v4 API is offline; its last response is read from the Internet Archive.
 *
 *   node scripts/build-legacy-map.ts
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LaunchSummary } from "../src/types/domain.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const ARCHIVED_V5 =
  "https://web.archive.org/web/20251006050535id_/https://api.spacexdata.com/v5/launches";

interface LegacyLaunch {
  id: string;
  name: string;
  date_utc: string;
  launch_library_id: string | null;
}

const MAX_DRIFT_MS = 48 * 3600 * 1000;

const tokens = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 3 || /\d/.test(w)),
  );

function sharesAWord(a: string, b: string): boolean {
  const other = tokens(b);
  return [...tokens(a)].some((w) => other.has(w));
}

/** Fallback when the legacy record has no LL2 id: the closest flight in time with a shared name word. */
function closestByDate(legacy: LegacyLaunch, index: LaunchSummary[]): LaunchSummary | undefined {
  const t = Date.parse(legacy.date_utc);
  let best: LaunchSummary | undefined;
  let bestDrift = MAX_DRIFT_MS;
  for (const launch of index) {
    if (!sharesAWord(legacy.name, launch.name)) continue;
    const drift = Math.abs(Date.parse(launch.net) - t);
    if (drift <= bestDrift) {
      best = launch;
      bestDrift = drift;
    }
  }
  return best;
}

const res = await fetch(ARCHIVED_V5);
if (!res.ok) throw new Error(`Internet Archive responded ${res.status}`);
const legacy = (await res.json()) as LegacyLaunch[];
const index = JSON.parse(
  await readFile(path.join(ROOT, "public", "data", "launches.json"), "utf8"),
) as LaunchSummary[];
const slugById = new Map(index.map((l) => [l.id, l.slug]));

const map: Record<string, string> = {};
const missing: string[] = [];
for (const launch of legacy) {
  const slug =
    (launch.launch_library_id && slugById.get(launch.launch_library_id)) ||
    closestByDate(launch, index)?.slug;
  if (slug) map[launch.id] = slug;
  else missing.push(launch.name);
}

await writeFile(
  path.join(ROOT, "src", "data", "legacy-ids.json"),
  JSON.stringify(map, null, 0) + "\n",
);
console.log(`Mapped ${Object.keys(map).length} of ${legacy.length} legacy launches.`);
if (missing.length) console.log(`Unmapped: ${missing.join(", ")}`);
