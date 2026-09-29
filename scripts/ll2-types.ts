/**
 * The subset of Launch Library 2 (v2.3.0, `mode=detailed`) that Downrange reads.
 * Kept deliberately partial: anything not listed here is ignored by the normalizer.
 */

export interface LL2Page<T> {
  count: number;
  next: string | null;
  results: T[];
}

export interface LL2Image {
  name: string | null;
  image_url: string;
  thumbnail_url: string | null;
  credit: string | null;
  license: { name: string } | null;
  single_use: boolean | null;
}

export interface LL2Config {
  id: number;
  name: string;
  full_name: string;
  variant: string | null;
  active: boolean;
  reusable: boolean;
  description: string | null;
  image: LL2Image | null;
  wiki_url: string | null;
  length: number | null;
  diameter: number | null;
  launch_mass: number | null;
  leo_capacity: number | null;
  gto_capacity: number | null;
  to_thrust: number | null;
  max_stage: number | null;
  maiden_flight: string | null;
}

export interface LL2LauncherStage {
  type: string;
  reused: boolean | null;
  launcher_flight_number: number | null;
  turn_around_time: string | null;
  launcher: { serial_number: string | null } | null;
  landing: {
    attempt: boolean;
    success: boolean | null;
    description: string | null;
    type: { abbrev: string; name: string } | null;
    landing_location: { name: string; abbrev: string | null } | null;
  } | null;
}

export interface LL2Astronaut {
  role: { role: string } | null;
  astronaut: { name: string; agency: { name: string; abbrev: string | null } | null };
}

export interface LL2SpacecraftStage {
  destination: string | null;
  spacecraft: { name: string; serial_number: string | null } | null;
  launch_crew: LL2Astronaut[] | null;
}

export interface LL2PayloadFlight {
  destination: string | null;
  payload: {
    name: string;
    type: { name: string } | null;
    mass: number | null;
    operator: { name: string } | null;
  };
}

export interface LL2Launch {
  id: string;
  slug: string;
  name: string;
  net: string;
  net_precision: { abbrev: string } | null;
  window_start: string | null;
  window_end: string | null;
  status: { abbrev: string; name: string };
  image: LL2Image | null;
  probability: number | null;
  weather_concerns: string | null;
  failreason: string | null;
  mission: {
    name: string;
    type: string | null;
    description: string | null;
    orbit: { name: string; abbrev: string } | null;
  } | null;
  pad: {
    name: string;
    latitude: number | string | null;
    longitude: number | string | null;
    location: { name: string; timezone_name: string | null };
  };
  rocket: {
    configuration: LL2Config;
    launcher_stage: LL2LauncherStage[] | null;
    spacecraft_stage: LL2SpacecraftStage[] | null;
    payloads: LL2PayloadFlight[] | null;
  };
  timeline:
    { relative_time: string; type: { abbrev: string; description: string | null } }[] | null;
  vid_urls:
    | {
        priority: number;
        title: string | null;
        url: string;
        publisher: string | null;
        source: string | null;
      }[]
    | null;
  info_urls:
    { priority: number; title: string | null; url: string; source: string | null }[] | null;
  mission_patches: { name: string; priority: number; image_url: string }[] | null;
  flightclub_url: string | null;
  agency_launch_attempt_count_year: number | null;
}
