---
name: Downrange
description: The SpaceX flight record, drawn as a strip chart. Unofficial.
colors:
  paper: "#f1f3ec"
  paper-sheet: "#fafbf6"
  paper-margin: "#e4e7dd"
  paper-shade: "#d9ddd1"
  grid-legend: "#276e4e"
  ink: "#15181a"
  ink-2: "#3f4649"
  ink-3: "#5a6265"
  pen-cobalt: "#1b44c4"
  pen-red: "#c01e17"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 0.9rem + 11.5vw, 8rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.2rem + 4.4vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.25rem + 2.2vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Archivo Variable, Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  reading:
    fontFamily: "Martian Mono Variable, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  legend:
    fontFamily: "Martian Mono Variable, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  none: "0"
  sm: "2px"
  md: "4px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "16px"
  "4": "24px"
  "5": "40px"
  "6": "64px"
  "7": "96px"
  "8": "144px"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-sheet}"
    rounded: "{rounded.sm}"
    padding: "0 18px"
    height: "44px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 18px"
    height: "44px"
  input-search:
    backgroundColor: "{colors.paper-sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 44px 0 40px"
    height: "44px"
  key-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-sheet}"
    padding: "0 14px"
    height: "42px"
  masthead:
    backgroundColor: "{colors.paper-margin}"
    textColor: "{colors.ink}"
    height: "64px"
---

# Design System: Downrange

## Overview

**Creative North Star: "The flight record as a strip chart"**

Downrange draws SpaceX's entire flight history the way a strip-chart recorder draws telemetry: pens writing onto a continuous roll of printed graph paper. The home page is the head of the roll, the pen parked at _now_; scrolling feeds the paper back through two decades. Every screen sits on the same cool chart paper with its green millimetric grid, and every mark on it is either **printed** (green legends, the grid, the feed margin) or **recorded** (pen ink: the data).

The system refuses the category default for space sites: no starfield, no hero photo over a grid of equal cards, no neon on near-black. Its density comes from instruments and records, not decoration. It is a light world because paper is its material.

**Key Characteristics:**

- Chart paper with a real, measuring grid (8 px minor, 40 px major divisions).
- Four pen inks, each with exactly one meaning.
- Condensed display numerals like chart legends; a variable-width mono for every reading.
- Charts drawn from data at runtime; the pen draws once as a chart enters view.
- Photographs printed in ink (greyscale, multiplied onto the paper) until looked at closely.

## Colors

The palette is paper plus pens. Colour strategy: restrained ground, committed inks.

### Primary

- **Carbon ink** (`#15181a`): the flight pen and all body text. Every flight tick, trace and heading.

### Secondary

- **Cobalt pen** (`#1b44c4`): booster landings and reuse, the live-timing dot, focus rings, text selection, and the saved state.

### Tertiary

- **Signal red** (`#c01e17`): failures and partial failures only.

### Neutral

- **Chart paper** (`#f1f3ec`): the page ground, cool and faintly green, never cream.
- **Sheet** (`#fafbf6`): raised surfaces that take writing: inputs, tables, key rows.
- **Feed margin** (`#e4e7dd`): masthead, footer and the perforated margin of the roll.
- **Paper shade** (`#d9ddd1`): skeletons and missing-photo frames.
- **Printed legend green** (`#276e4e`): everything the paper manufacturer printed: grid, axis labels, field labels, legends. 5.3:1 on paper.
- **Ink 2 / Ink 3** (`#3f4649` / `#5a6265`): secondary and tertiary text, 8.5:1 and 5.6:1 on paper.

### Named Rules

**The One Ink, One Meaning Rule.** Red is failure and nothing else; cobalt is recovery, focus and live state. Never use either as decoration, emphasis or for app errors (a failed request is drawn as a broken carbon trace).

**The Printed vs Recorded Rule.** Labels, axes and legends are printed in green mono caps; data is recorded in ink. If a string describes a value, it is green; if it is the value, it is ink.

**The Never Colour Alone Rule.** Every outcome also differs in shape: filled square (success), cross (failure), half-filled square (partial), dashed square (scheduled); landings are filled or hollow dots.

## Typography

**Display Font:** Archivo Variable (width axis 62–125 %), with Archivo, system sans fallback.
**Body Font:** Archivo Variable at normal width.
**Label/Mono Font:** Martian Mono Variable (width axis 75–112.5 %), used at 87.5 % width.

**Character:** One grotesk family stretched like an instrument legend: condensed and heavy for numerals and headings, extra-wide for the wordmark. Martian Mono carries every measurement, date and code with tabular figures.

### Hierarchy

- **Display** (800, `clamp(3.5rem, 11.5vw, 8rem)`, 0.9, width 70 %): the countdown and the flight number only.
- **Headline** (800, `clamp(2.25rem, 4.4vw, 4.5rem)`, 0.95, width 70 %): page titles and mission names.
- **Title** (800, `clamp(1.75rem, 2.2vw, 2.75rem)`, 1.15, width 70 %): section headings.
- **Body** (400, 1rem, 1.55): prose, max measure 66ch.
- **Reading** (Martian Mono 400, 0.875rem, tabular): dates, stamps, specs, counts.
- **Legend** (Martian Mono 500, 0.6875rem, +0.06em, uppercase, green): labels printed on the paper.

### Named Rules

**The Mono Is Measurement Rule.** Martian Mono only sets data, time, measurements and printed legends, never prose or decoration.

**The Precision Honesty Rule.** Dates print with no more precision than the record holds: "Q4 2026" never becomes a countdown to a fake second.

## Layout

A 12-column grid inside `min(100% − 2 × gutter, 1400px)`, gutter `clamp(16px, 4vw, 40px)`. Spacing uses the 8 px division: 4, 8, 16, 24, 40, 64, 96, 144. Headers split title (5 columns) from context (7 columns) on wide screens.

Breakpoints: 480, 768, 1024, 1280 px. Below 1024 px everything stacks to one column; below 768 px the navigation uses short labels. Flight rows respond to their container (`@container flights`, 860 px), not the viewport, so the same row works in a full log and a half-width column.

Charts change form, not just size, on narrow screens: the two-decade roll becomes a year-per-row stack, the T-minus sequence becomes a vertical trace list, and the fleet chart scrolls horizontally inside its own frame. No page ever scrolls horizontally.

### Named Rules

**The Measure Equals Data Rule.** Widths that look like bars are data: a year's band length is its flight count; the fleet chart is drawn at 4 px per metre, so one major division of the paper is ten metres.

## Elevation & Depth

Flat by default: paper lies on paper, separated by rules (1px `rgb(21 24 26 / .16)` hairlines, 2px ink rules for major breaks, dashed rules between home sections). Depth appears only for things lifted off the roll: toasts and the chart readout (`0 2px 4px rgb(21 24 26 / .08), 0 14px 28px -10px rgb(21 24 26 / .28)`) and the mission patch on a flight sheet (a drop shadow on the cut-out).

## Shapes

Square and ruled. Controls use a 2 px radius; nothing is pill-shaped or rounded beyond 4 px. Borders are 1.5 px ink on interactive elements. The feed margin carries circular sprocket holes every 40 px.

## Components

### Buttons

- **Ink** (primary): carbon fill, sheet text, 1.5 px ink border, uppercase semi-condensed 700, 44 px high. Hover lightens to `#2c3134`; press nudges 1 px down.
- **Line** (secondary): transparent with ink border; hover adds a 7 % ink wash.
- **Quiet**: underlined text action for inline and list endings.

### Instrument keys (segmented choice)

Native radio buttons rendered as a row of keys inside a 1.5 px ink frame, separated by hairlines. The selected key inverts to ink; counts print in mono beside labels. A disabled group fades to 50 %.

### Inputs / Fields

Sheet-coloured field, 1.5 px ink border, 44 px high, search icon inset left, a clear button inset right. Labels are printed legends above the field.

### Navigation

Masthead on the feed-margin colour with a 2 px ink rule below: the wordmark (extra-wide Archivo, underlined by one pen trace that spikes once) on the left, uppercase semi-condensed links, the active link underlined by a 2 px ink bar, and the pen legend on the right on wide screens.

### Flight row (signature)

One flight on the roll: outcome tick, flight number, UTC stamp, mission as a stretched link, vehicle · site · orbit, recovery dots in cobalt, outcome mark and an icon save toggle. It reflows to three lines in narrow containers.

### Charts (signature)

Recent trace, two-decade roll, reuse curve, T-minus sequence and fleet to scale, all SVG drawn from the snapshot at their measured pixel width. Each draws once with a pen stroke (`pathLength`, 1.4–2 s, `cubic-bezier(0.22, 1, 0.36, 1)`) and renders its final state for reduced motion. Each has a text or table equivalent for assistive technology.

## Do's and Don'ts

### Do:

- **Do** compute every figure from the snapshot or its records and show the snapshot date.
- **Do** keep red for failures only and pair every outcome colour with its shape.
- **Do** set dates, specs and counts in Martian Mono with tabular figures.
- **Do** let charts change form on small screens rather than shrinking to illegibility.
- **Do** label photographs that show the vehicle rather than the flight, and credit every image.

### Don't:

- **Don't** use a starfield, nebula, glassmorphism or neon-on-black: the world is paper.
- **Don't** build pages from equal cards, big-number stat tiles or a kicker above a heading.
- **Don't** use colour as the only carrier of meaning, or red for anything but failure.
- **Don't** add a countdown to a date the record only knows to the month or quarter.
- **Don't** use monospace as a "technical" costume for prose.
