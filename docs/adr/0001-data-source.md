# ADR 0001 — Data source: Launch Library 2 snapshot + one live request

- **Status:** accepted
- **Date:** 2026-09-29

## Context

The app consumed the community SpaceX API (`api.spacexdata.com` v4/v5). Its repository was archived and, since mid-2026, every endpoint returns HTTP 525. Even before that, its data stopped at October 2022 (205 launches). The deployed app showed an empty list.

Launch Library 2 (The Space Devs) is actively maintained (860 SpaceX launches at the time of writing, CORS enabled) but allows 15 anonymous requests per hour per IP. Loading the full SpaceX record takes 9 requests of 100 detailed launches.

## Decision

1. A sync script (`npm run sync`) downloads the full SpaceX record from LL2 and **normalizes it into our own domain model** (`src/types/domain.ts`), written as static JSON under `public/data/`:
   - `launches.json` — compact index of every launch (list, search, filters, statistics);
   - `launches/<slug>.json` — one detail file per launch;
   - `rockets.json` — vehicle configurations with specs and computed records;
   - `meta.json` — source, generation time and counts.
2. A scheduled GitHub Action runs the sync daily and commits the snapshot when it changes, which redeploys the site.
3. The only live call from the browser is the **next upcoming launch** (one request, cached by TanStack Query, 10 min stale time). If it fails or is rate limited, the snapshot's next launch is used.
4. The UI always shows the snapshot date ("Record as of …").
5. Old SpaceX API ids are mapped to LL2 slugs (`src/data/legacy-ids.json`, built from the last archived v4 response) so old `/launcher/:id` links and saved favourites keep working.

## Consequences

- The site is fast and independent of LL2 availability; a failed sync only means slightly older data.
- Data freshness is bounded by the sync cadence (daily) except for the live next launch.
- The normalization layer makes the provider swappable.
- LL2 image licences vary (CC BY-NC 2.0, NASA, unknown): every image shows its credit.
