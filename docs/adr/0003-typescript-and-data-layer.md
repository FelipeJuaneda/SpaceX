# ADR 0003 — TypeScript and a TanStack Query data layer

- **Status:** accepted
- **Date:** 2026-09-29

## Decision

- The codebase moves to **TypeScript** (strict). The LL2 response types live only in the sync script; the app consumes our own domain types (`Launch`, `LaunchSummary`, `Rocket`, `Outcome`…), so the UI never depends on the provider's shape.
- **TanStack Query** owns fetching: caching, loading/error states, retries, and deduplication. Services in `src/services/` are plain async functions; hooks in `src/features/*/api` wrap them in queries.
- **URL as state** for everything shareable (search, filters, year): `useSearchParams`.
- **Saved flights** are stored as ids in `localStorage` behind a tiny external store read with `useSyncExternalStore` (no global context, no stale copies of launch data).
- Routing uses **React Router 7** data routers with lazy route modules (code splitting per route).

## Consequences

Type errors surface at build time; the data layer is unit-testable without React; route chunks load on demand.
