---
version: 1
slug: "src-routes-home-homeroute-tsx"
primary_target: "src/routes/home/HomeRoute.tsx"
related_targets: ["src/routes/launches","src/routes/launch","src/routes/rockets"]
---

## Scope

Home route of Downrange (`/`). Mode: Experience — the record itself leads from the first viewport. Related surfaces (flight log, flight sheet, fleet) inherit the same world.

## Audience and job

Enthusiasts checking what launches next and browsing the history; recruiters judging craft in one viewport. Job: know the next launch, feel the scale of the record, reach any flight in one click.

## Direction contract

THESIS: SpaceX's whole flight history is one continuous strip-chart roll drawn by recorder pens; the home is the head of the roll. It refuses the category default of a starfield hero photo over a grid of equal cards.

OWN-WORLD: cool chart paper with a printed green millimetric grid and a perforated feed margin carrying dates; pen inks: carbon for flights, cobalt for booster landings, signal red only for failures, dashed carbon for anything not yet flown. Condensed display numerals like chart legends, variable-width mono for every reading. Controls are channel selectors and instrument keys on the paper, never floating cards.

STORY: the visitor sees the next launch counting down at the pen head, sees the last weeks already drawn behind it, scrolls to feed the paper back through two decades of cadence and reuse, and opens any tick as a flight sheet.

FIRST VIEWPORT: masthead strip (logotype left, channel legend + nav right) above the paper. Left 7 columns: the T-minus countdown set huge in condensed numerals (clamp ~4.5rem mobile to ~11rem desktop), mission name, vehicle, pad, window, and the primary action "Open flight sheet"; secondary "Read the roll". Right 5 columns (below on mobile): the live chart — last ~90 days of flights as ticks on the grid, pen head parked at NOW, scheduled flights ahead as dashed ticks. Snapshot date printed on the margin.

FORM: #6 of 7 grounded candidates, strip-chart recorder. Seed b4c827b8.

SIGNATURE INTERACTION: the pen draws — traces are stroked in once as each chart enters view; hovering or focusing a tick prints its reading (flight no., date, mission, outcome) on the chart margin.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

Two decades on one roll: every flight as a tick positioned by date, failures in red, cadence visibly exploding after 2020.

## Unresolved

None blocking. Dark mode deliberately not shipped in v1: the world is paper.
