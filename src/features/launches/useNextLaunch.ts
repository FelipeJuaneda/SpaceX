import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { LaunchSummary, TimePrecision } from "@/types/domain";
import { liveNextLaunchQuery } from "./queries";
import { nextScheduled } from "./selectors";

/**
 * The live request is skipped in local development unless VITE_LIVE=1, to stay well inside
 * Launch Library 2's 15 requests/hour anonymous limit while reloading.
 */
const LIVE_ENABLED = !import.meta.env.DEV || import.meta.env.VITE_LIVE === "1";

export interface NextLaunch {
  launch: LaunchSummary;
  /** Timing confirmed by the live API in this session (vs. the daily snapshot). */
  live: boolean;
  /** A flight sheet exists in the snapshot for this slug. */
  inSnapshot: boolean;
}

/** Next SpaceX launch: live timing when available, the snapshot otherwise. */
export function useNextLaunch(
  launches: readonly LaunchSummary[] | undefined,
  /** Reference time for the snapshot fallback, fixed by the caller for a stable render. */
  now: number,
): {
  next: NextLaunch | null;
  checkingLive: boolean;
} {
  const live = useQuery({ ...liveNextLaunchQuery(), enabled: LIVE_ENABLED });

  const next = useMemo<NextLaunch | null>(() => {
    if (!launches) return null;
    const liveData = live.data;
    if (liveData) {
      const known = launches.find((l) => l.slug === liveData.slug);
      const base: LaunchSummary =
        known ??
        ({
          ...fallbackShape(liveData.name),
          slug: liveData.slug,
          name: liveData.name,
          mission: liveData.mission,
        } as LaunchSummary);
      return {
        launch: {
          ...base,
          net: liveData.net,
          precision: liveData.precision as TimePrecision,
          status: liveData.status,
        },
        live: true,
        inSnapshot: Boolean(known),
      };
    }
    const scheduled = nextScheduled(launches, now);
    return scheduled ? { launch: scheduled, live: false, inSnapshot: true } : null;
  }, [launches, live.data, now]);

  return { next, checkingLive: LIVE_ENABLED && live.isPending };
}

/** Minimal record for a launch the live API knows about but today's snapshot does not yet. */
function fallbackShape(name: string): Partial<LaunchSummary> {
  const vehicle = name.split(" | ")[0] ?? "SpaceX";
  return {
    id: "",
    flight: null,
    outcome: "upcoming",
    vehicle,
    vehicleSlug: "",
    family: vehicle.startsWith("Starship")
      ? "starship"
      : vehicle === "Falcon Heavy"
        ? "falcon-heavy"
        : "falcon-9",
    pad: "",
    site: "",
    orbit: null,
    missionType: null,
    crewed: false,
    landings: { attempted: 0, landed: 0 },
    reused: false,
    thumb: null,
    patch: null,
  };
}
