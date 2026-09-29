# Design directions — Phase 1

Working record of how the visual world was chosen. Product truth lives in `PRODUCT.md`; the built system is documented in `DESIGN.md`.

## Grounding

- **Mechanism:** the complete, computed flight record of SpaceX — every launch since 2006, outcome first, with provenance.
- **Audience scene:** an enthusiast on a phone the night before a launch; a recruiter skimming the portfolio on a laptop between calls.
- **Cultural home:** range operations and flight test instrumentation — countdown nets, telemetry, launch manifests, mission patches, tracking maps.
- **The rut (excluded):** dark starfield + hero photo of a rocket + grid of equal cards; and its predictable opposite, a white Swiss analytics dashboard.

## Seven grounded candidates (ordered by resonance)

1. **Mission Control console** — telemetry panes, mono readouts, countdown clocks. The brief's own example; the most familiar reading.
2. **Mission patch embroidery** — twill, thread colours, circular badge systems; every flight has a patch.
3. **Split-flap departures board** — upcoming launches as departures, past ones as a board history.
4. **Tracking-station plotting board** — ground tracks drawn over a Mercator projection.
5. **Printed range schedule / launch manifest** — the ledger document ranges circulate before a campaign.
6. **Strip-chart recorder** — pens drawing telemetry onto a continuously fed roll of graph paper.
7. **Long-exposure launch photography** — streak prints of ascents over the pad.

Material families covered: screen instruments (1, 6), textile (2), transit signage (3), cartography (4), print documents (5), photography (7).

## The roll

`impeccable concept-seed --scope direction --mode experience` → seed `b4c827b8`, assigned index **6: strip-chart recorder**.

### Challengers (fused with the product, weighed on audience identification × product clarity)

| Challenger                      | Verdict                                                                                                   | What the direction kept (raise)                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Oscilloscope on a signal bench  | Competitive (audience) — loses clarity: one screen of overlaid signals cannot carry 860 browsable records | **Measure discipline:** every element sits on the chart grid; spacing is counted in grid divisions, not arbitrary pixels |
| Spy-film dossier title sequence | Declined                                                                                                  | **One alarm ink, one meaning:** red is reserved exclusively for failure, nowhere else in the system                      |
| HyperCard shoebox stack         | Declined                                                                                                  | **Every state addressable:** filters, year, and flight live in the URL; back retraces the exact trail                    |
| Coiled earthen tower            | Declined                                                                                                  | **Measure equals data:** a year's band length on the roll is its launch count, never a decorative width                  |
| Wuxia painted hoarding          | Declined                                                                                                  | **The held moment:** each flight sheet is anchored on T‑0, the instant the record is about                               |
| Akari light sculpture           | Declined (not carried into the hand)                                                                      | —                                                                                                                        |

**Impeccable's pick (not built):** Mission Control console. Honest risk: it is where nearly every space UI lands; strong but familiar.

The user delegated the choice ("vos hacé todo"), so the assigned direction was built without a decision round.

## Chosen direction — DOWNRANGE, the flight record as a strip chart

**Name:** _Downrange_ — the distance a vehicle has travelled from its launch site; the roll unspools downrange. Logotype: the word set wide in the display face, underlined by a single pen trace that spikes once. Tagline: _The SpaceX flight record. Unofficial._

**World:** cool chart paper printed with a green millimetric grid; a perforated feed margin carries the time axis. Four pen inks: carbon (flights), cobalt (booster landings and reuse), signal red (failures only), and a dashed carbon trace for anything not yet flown. Condensed display numerals like chart legends; a variable-width mono for every reading.

**Surfaces**

- **Home — the head of the roll:** the pen parked at _now_; the next launch counting down ahead on the unfed paper; the last weeks of flights already drawn behind it. Scrolling feeds the paper back through two decades.
- **Flight log (`/launches`):** the whole roll. Years are printed on the feed margin; each flight is a row with its tick. Filters are channel selectors.
- **Flight sheet (`/launches/:slug`):** a sheet torn off at T‑0. The real countdown timeline from Launch Library 2 is plotted as a trace from T‑minus to T‑plus, with boosters, landings, orbit and payload as readings beside it.
- **Fleet (`/rockets`):** a calibration sheet. Every vehicle is drawn to scale on the same millimetric grid, so the grid is the measuring tool.
- **Saved, About, 404:** the same paper; the 404 is a trace running off the chart.

## Memorable moments (each with a purpose and a light fallback)

1. **Live countdown at the pen head** — purpose: answers "what's next" instantly. Live LL2 request, falling back to the snapshot; if the time precision is coarser than an hour it shows "NET October 2026" instead of a fake clock.
2. **Two decades on one roll** — every flight as a tick positioned by date; failures in red, cadence visibly exploding after 2020. Drawn once as the chart enters view. Reduced motion: static.
3. **T‑minus sequence** — the flight's real timeline events plotted along the time axis, drawn by the pen. Fallback: an accessible ordered list, which is also what screen readers get.
4. **Fleet to scale** — silhouettes computed from real length and diameter on the grid; Starship vs Falcon 1 at a glance. Fallback: a spec table.
5. **The reuse trace** — cumulative booster landings (cobalt) climbing alongside flights flown, annotated with the most-flown booster.

WebGL/3D was considered and declined: a paper instrument is two-dimensional by nature; a 3D globe would be a costume from another world and a large performance cost on phones.
