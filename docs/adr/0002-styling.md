# ADR 0002 — Styling: CSS Modules + design tokens, MUI removed

- **Status:** accepted
- **Date:** 2026-09-29

## Context

The app used MUI 5 mostly as a box/typography toolkit with inline `sx` colours; its theme only wrapped the navbar. The redesign commits to a bespoke visual world (a strip-chart recorder) where every control is rebuilt in that world's vocabulary.

## Options

| Option                                  | Benefit                                                                                                                                                  | Cost                                                                                                                                               |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keep MUI with a full custom theme       | Accessible components out of the box                                                                                                                     | Fighting Material defaults (ripples, elevation, density) on every component; ~90 KB gzip of runtime CSS-in-JS for a UI that uses almost none of it |
| Tailwind CSS                            | Fast iteration, tokens via theme                                                                                                                         | Long class strings obscure the bespoke grid maths; the design relies on custom properties computed per component (grid divisions, pen positions)   |
| **CSS Modules + CSS custom properties** | Zero runtime, scoped styles, native CSS features (container queries, `@layer`, scroll-driven animations), tokens as plain variables readable in DevTools | Accessibility primitives must be built by hand                                                                                                     |

## Decision

CSS Modules for component styles, a single `src/styles/tokens.css` for design tokens, global layers in `src/styles/global.css`. No component library: the few interactive primitives (toggle group, disclosure, search field) are native HTML elements styled by us. Icons come from one set, `lucide-react`, at one stroke width.

## Consequences

- MUI, Emotion, Roboto and `react-icons` are removed (bundle and font weight drop sharply).
- Accessibility is our responsibility: covered by tests and the audit in Phase 4.
