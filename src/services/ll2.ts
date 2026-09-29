/**
 * The single live request the app makes: SpaceX's next upcoming launch from Launch Library 2.
 * Everything else comes from the static snapshot. Anonymous LL2 access allows 15 requests
 * per hour per IP, so this is cached for 10 minutes and falls back to the snapshot on failure.
 */
import type { TimePrecision } from "@/types/domain";
import { missionFromName, outcomeOf, precisionOf } from "@/lib/ll2-mapping";
import { fetchJson } from "./http";

const URL =
  "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?lsp__id=121&limit=3&mode=list&hide_recent_previous=true";

interface LL2ListLaunch {
  slug: string;
  name: string;
  net: string;
  net_precision: { abbrev: string } | null;
  status: { abbrev: string; name: string };
  window_start: string | null;
}

export interface LiveNextLaunch {
  slug: string;
  name: string;
  mission: string;
  net: string;
  precision: TimePrecision;
  status: string;
  fetchedAt: string;
}

export async function fetchNextLaunch(signal?: AbortSignal): Promise<LiveNextLaunch | null> {
  const body = await fetchJson<{ results: LL2ListLaunch[] }>(URL, { signal });
  const now = Date.now();
  // LL2 keeps a launch in "upcoming" briefly after liftoff; skip anything already past T-0.
  const next = body.results.find((l) => Date.parse(l.net) > now - 60_000);
  if (!next) return null;
  return {
    slug: next.slug,
    name: next.name,
    mission: missionFromName(next.name),
    net: next.net,
    precision: precisionOf(next.net_precision?.abbrev, outcomeOf(next.status.abbrev)),
    status: next.status.name,
    fetchedAt: new Date().toISOString(),
  };
}
