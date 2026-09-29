import type { LaunchDetail, LaunchSummary } from "@/types/domain";

/** A plausible flown Falcon 9 flight; override what each test cares about. */
export function launch(over: Partial<LaunchSummary> = {}): LaunchSummary {
  return {
    id: "id-demo",
    slug: "falcon-9-demo",
    flight: 1,
    name: "Falcon 9 Block 5 | Demo",
    mission: "Demo",
    net: "2020-05-30T19:22:45Z",
    precision: "second",
    outcome: "success",
    status: "Launch Successful",
    vehicle: "Falcon 9 Block 5",
    vehicleSlug: "falcon-9-block-5",
    family: "falcon-9",
    pad: "Launch Complex 39A",
    site: "Kennedy Space Center",
    orbit: "LEO",
    missionType: "Test Flight",
    crewed: false,
    landings: { attempted: 1, landed: 1 },
    reused: false,
    thumb: null,
    patch: null,
    ...over,
  };
}

export function detail(over: Partial<LaunchDetail> = {}): LaunchDetail {
  return {
    ...launch(),
    description: "A test flight.",
    image: null,
    patches: [],
    window: { start: null, end: null },
    probability: null,
    weather: null,
    failReason: null,
    location: { name: "Kennedy Space Center, FL, USA", lat: 28.608, lon: -80.604, timezone: null },
    orbitName: "Low Earth Orbit",
    stages: [],
    spacecraft: [],
    payloads: [],
    timeline: [],
    videos: [],
    links: [],
    yearCount: 8,
    prev: null,
    next: null,
    ...over,
  };
}

/** Oldest first, like the snapshot. */
export const sampleLaunches: LaunchSummary[] = [
  launch({
    slug: "falcon-1-falconsat-2",
    flight: 1,
    name: "Falcon 1 | FalconSAT-2",
    mission: "FalconSAT-2",
    net: "2006-03-24T22:30:00Z",
    outcome: "failure",
    vehicle: "Falcon 1",
    vehicleSlug: "falcon-1",
    family: "falcon-1",
    landings: { attempted: 0, landed: 0 },
  }),
  launch({
    slug: "falcon-9-v11-spx-crs-7",
    flight: 2,
    name: "Falcon 9 v1.1 | SpX CRS-7",
    mission: "SpX CRS-7",
    net: "2015-06-28T14:21:11Z",
    outcome: "failure",
    vehicle: "Falcon 9 v1.1",
    vehicleSlug: "falcon-9-v1-1",
    landings: { attempted: 0, landed: 0 },
  }),
  launch({
    slug: "falcon-9-block-5-spx-dm2",
    flight: 3,
    name: "Falcon 9 Block 5 | SpX-DM2",
    mission: "SpX-DM2 (Demonstration Mission 2)",
    net: "2020-05-30T19:22:45Z",
    crewed: true,
  }),
  launch({
    slug: "falcon-9-block-5-starlink-10-49",
    flight: 4,
    name: "Falcon 9 Block 5 | Starlink Group 10-49",
    mission: "Starlink Group 10-49",
    net: "2024-11-01T10:00:00Z",
    reused: true,
  }),
  launch({
    slug: "falcon-9-block-5-crew-13",
    flight: null,
    name: "Falcon 9 Block 5 | Crew-13",
    mission: "Crew-13",
    net: "2099-10-01T15:10:06Z",
    outcome: "upcoming",
    status: "Go for Launch",
    crewed: true,
    landings: { attempted: 1, landed: 0 },
  }),
];
