# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Space enthusiasts and curious visitors** who want to browse SpaceX's flight history, check what launches next, and understand what happened on a given mission.
- **Recruiters and developers** evaluating the author's portfolio. They skim: the first viewport, the quality of details, and the code/README decide their impression in under a minute.

## Product Purpose

An unofficial, independent explorer of SpaceX launch data: every flight since 2006, what is scheduled next, the rockets that flew them, and what the record adds up to (cadence, reuse, landings, failures). Success means a visitor can find any flight in seconds, understands its outcome at a glance, and remembers the site afterwards. As a portfolio piece it must also show professional engineering: typed data layer, tests, accessibility, performance.

## Positioning

A data explorer, not a fan site or a copy of spacex.com. Its claim is completeness and honesty about the record: every launch including failures and upcoming flights, with the data's source and freshness always visible.

## Operating Context

- Visitors arrive on desktop and on phones (links shared in chats/social). Mobile must be first-class.
- Data comes from Launch Library 2 (The Space Devs), synced into a static, versioned snapshot at build time; a single live request refreshes the next upcoming launch. The previous source (community SpaceX API) went offline in 2026 and froze its data in October 2022.
- Deployed as a static SPA (Vercel config present in repo).

## Capabilities and Constraints

- Existing features to preserve: launch list with search and pagination, launch detail, favorites persisted in localStorage (with sort A–Z / Z–A).
- LL2 anonymous rate limit: 15 requests/hour per IP. Nothing may depend on per-visitor bulk requests to LL2.
- Images come from LL2 and carry credit/license metadata that must be shown.
- Inferred (delegated by the user): scope expands to rockets/fleet, statistics, and a data/colophon page.

## Brand Commitments

- Unofficial project: must not use SpaceX's logo, wordmark, or imitate spacex.com. Needs its own product name and typographic logotype (delegated to the designer).
- A discreet disclaimer in the footer stating it is not affiliated with SpaceX.
- Copy language: English (inferred from the existing UI; the author communicates in Spanish).

## Evidence on Hand

- Real data: LL2 launch records (status, timeline, landings, boosters, mission patches, images with credits), rocket configuration specs.
- Legacy snapshot of the old SpaceX API (205 launches, 2006–2022) only for mapping old URLs and favorites.
- No testimonials, metrics, or press. Do not fabricate statistics; every number shown must be computed from the data.

## Product Principles

1. The record is the product: every figure is computed from data and traceable to its source and date.
2. Outcome first: for any flight, what happened (success, failure, upcoming) is the first thing read, never encoded by color alone.
3. Fast everywhere: memorable moments never block content and degrade to light fallbacks.
4. Honest about limits: data freshness, missing images, and unknowns are shown, not hidden or papered over with filler text.

## Accessibility & Inclusion

WCAG 2.2 AA required: contrast, visible focus, full keyboard use, meaningful alt text, targets ≥ 44px, and `prefers-reduced-motion` respected everywhere (including 3D, scroll-driven and Framer Motion animation).
