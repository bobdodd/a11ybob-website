# 0004 — Design system principles

**Date:** 2026-05-05
**Status:** Accepted

## The seven principles

1. **AAA contrast as the floor, not AA.** Body text 7:1, large text 4.5:1,
   non-text 3:1. Most a11y-positioned sites quietly hit AA and stop. AAA is
   harder, constrains the palette, and is exactly the constraint a site
   claiming Oracle authority should publicly accept.

2. **Typography is the primary UI.** The site is reading-first. All type and
   spacing derive from a single modular scale (ratio 1.2). Body type fluid
   via `calc(1rem + 0.25vw)` — never pinned to a fixed pixel root.

3. **Honour every `prefers-*` query.** `prefers-color-scheme`,
   `prefers-contrast` (more *and* less), `prefers-reduced-motion`,
   `prefers-reduced-data`. Not just reduced-motion.

4. **Focus appearance meets WCAG 2.4.11 explicitly.** Solid 2px outline at
   the accent colour, offset 3px from the element edge so it can never be
   mistaken for an image border, plus a halo box-shadow in the surface
   colour as a second contrast layer. Works against any background the
   focused element happens to sit against.

5. **Native HTML first; ARIA only where native genuinely fails.** Real
   `<button>`, real `<dialog>`, real `<details>`. Combobox, focus trap, and
   live-region patterns enter only on the surfaces that need them.

6. **Rich JS done accessibly, with progressive enhancement where possible.**
   Search, Playground, code-analysis surfaces are JS-required and that's
   honestly stated. Anywhere graceful degradation is achievable, ship it.

7. **Reading mode for long-form articles.** First-class state, not a CSS
   query. Default theme + a focus mode that strips chrome to a single
   column with maximum measure.

## Why these specifically

The set deliberately excludes "obvious" principles like *don't rely on
colour alone* and *no autoplay video* — Bob is a senior practitioner; the
basics are assumed. The seven above are the *distinctive stances* that read
as load-bearing decisions rather than WCAG remedial.

## Layout foundation

The site adopts **Heydon Pickering and Andy Bell's Every Layout** as the
layout system. Twelve primitives — Stack, Box, Center, Cluster, Sidebar,
Switcher, Cover, Grid, Frame, Reel, Imposter, Icon, Container — composed
together rather than specialised components invented per UI surface.

Implemented as class-based CSS in [src/styles/layouts/](../../src/styles/layouts/),
adapted faithfully from the book. Bob owns the licence; Heydon and Andy
will be credited prominently in the colophon.

Reasons:
- Heydon's name on the property is itself a credibility signal.
- The primitives handle responsiveness intrinsically (content-derived
  sizing, no media-query reconfiguration of layout).
- Logical properties throughout (`inline-size`, `margin-block`,
  `padding-inline-end`) — i18n-ready.
- The book becomes a citable reference for the colophon and any future
  build articles.

## CSS architecture

- Vanilla CSS. No preprocessor, no Tailwind, no CSS Modules.
- Design tokens as CSS custom properties in [src/styles/tokens.css](../../src/styles/tokens.css).
- `@layer` ordering in [src/app/globals.css](../../src/app/globals.css):
  `tokens, axioms, base, layouts, components, utilities`.
- Exception-based selectors (universal rule + `:not()` overrides) rather
  than class-by-class application.
- Owl selector (`* + *`) for spacing relationships, never per-element
  margins.

CSS Modules were rejected (despite the Next.js default) because Every
Layout is class-based and global, and we want one source of truth for the
modular scale and tokens. Module scoping ceremony conflicts with the
exception-based approach.

## Fonts

- **Body:** Atkinson Hyperlegible (designed by the Braille Institute
  specifically for legibility at low-vision conditions; the on-brand choice
  for an a11y-positioned site). 400 and 700, both italic. Loaded via
  `next/font/google`.
- **Headings:** Source Serif 4 (variable weight). Pairs with Atkinson — the
  serif/sans contrast is itself a non-chromatic signal that "this is
  structure, not body."
- **Code:** system monospace stack (`ui-monospace`, `SFMono-Regular`,
  `Menlo`, `Consolas`). Zero payload, every OS already has a good one.

## Skip-link as axiom

Every page has a skip-link to the main content via the `.skip-link` class
applied in the root layout. Visually hidden until focused; standard
practice but easy to forget — encoded centrally so it can't be omitted.
