# Redesign plan

Branch: `redesign`. Conventional commits, small and per phase.

## Phase 0 — Discovery ✅
Audit of the legacy app (score 6/20), data source investigation, screenshots at 375 / 768 / 1440.

## Phase 1 — Direction and plan ✅
- `PRODUCT.md`, `docs/design/directions.md` (world: *Downrange*, a strip-chart recorder).
- ADRs: data source (0001), styling (0002), TypeScript + data layer (0003).

## Phase 2 — Foundation
- Vite 8, React 19, TypeScript 6, React Router 7, TanStack Query 5, Motion, lucide-react, Vitest.
- Remove MUI/Emotion/Roboto/react-icons/auto-animate; ESLint 10 flat config + Prettier; `@/` import alias.
- Sync script + normalized snapshot + daily GitHub Action; legacy id map.
- Design tokens (`src/styles/tokens.css`): colour, type scale, grid-based spacing, radii, shadows, z-index, breakpoints, durations, easings.
- Base components: layout (masthead, footer), chart primitives (paper, axis, trace, tick), UI (button, toggle, search field, readout, skeleton, empty/error states, outcome mark).

## Phase 3 — Screens
Home, Flight log (search/filters/sort in the URL), Flight sheet, Fleet, Rocket sheet, Saved, About/Data, 404. Loading skeletons with real shape, empty, error + retry, legacy redirects.

## Phase 4 — Quality
Per-route code splitting, image strategy, Lighthouse ≥ 90 (mobile perf + a11y), per-page metadata and Open Graph image, favicon, tests for critical flows, README.

## Behaviour changes (announced)
- Pagination is replaced by a continuous roll grouped by year with a year index (every flight is still reachable; search/filter narrow it).
- `/favorites` → `/saved` and `/launcher/:id` → `/launches/:slug` (redirects keep old links working).
- Saved flights migrate automatically from the old storage key.
