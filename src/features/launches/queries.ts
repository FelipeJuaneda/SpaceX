import { queryOptions } from "@tanstack/react-query";
import { fetchNextLaunch } from "@/services/ll2";
import { getLaunch, getLaunches, getMeta, getRockets } from "@/services/snapshot";

/** Snapshot files are immutable per deploy, so they never go stale within a session. */
const SNAPSHOT = { staleTime: Infinity, gcTime: 30 * 60_000 } as const;

export const launchesQuery = () =>
  queryOptions({ queryKey: ["snapshot", "launches"], queryFn: getLaunches, ...SNAPSHOT });

export const launchQuery = (slug: string) =>
  queryOptions({
    queryKey: ["snapshot", "launch", slug],
    queryFn: () => getLaunch(slug),
    ...SNAPSHOT,
  });

export const rocketsQuery = () =>
  queryOptions({ queryKey: ["snapshot", "rockets"], queryFn: getRockets, ...SNAPSHOT });

export const metaQuery = () =>
  queryOptions({ queryKey: ["snapshot", "meta"], queryFn: getMeta, ...SNAPSHOT });

export const liveNextLaunchQuery = () =>
  queryOptions({
    queryKey: ["live", "next-launch"],
    queryFn: ({ signal }) => fetchNextLaunch(signal),
    staleTime: 10 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
