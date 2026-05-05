# 0006 — Type scale capped at 3:1 (magnifier accommodation)

**Date:** 2026-05-05
**Status:** Accepted

## The constraint

The largest and smallest text rendered on any page differ by no more than
**3:1** in size.

## Why

Screen-magnifier users (ZoomText, Windows Magnifier, macOS Zoom) read at
high zoom levels — often 200–800%. When a page's type scale spans a wide
ratio (5:1, 6:1, 8:1 are common), magnifier users have to repeatedly adjust
zoom level to read both the heading (which is too big at their preferred
zoom) and the body text (which is too small at the heading's zoom). Capping
the type scale at 3:1 ensures both fit in the magnified viewport at usable
size simultaneously.

This is a real constraint, raised by Bob from his work at CNIB Access Labs.
Almost no design system explicitly accommodates it — most ship type scales
with 4:1 or 5:1 ratios because designers like big hero type. The 3:1 cap is
a quiet but distinctive accessibility decision.

## Math

For a modular scale with ratio `r` and `n` steps between smallest and
largest sizes used, the constraint is `r^n ≤ 3`.

| Ratio | Music name | Max steps under 3:1 |
|---|---|---|
| 1.5 | Perfect fifth | 2 |
| 1.414 | Augmented fourth | 2 |
| 1.333 | Perfect fourth | 3 |
| 1.25 | Major third | 4 |
| **1.2** | **Minor third** | **6** |
| 1.125 | Major second | 9 |

## The chosen ratio: 1.2

Six distinct steps within the 3:1 cap — enough for caption + body + four
heading sizes (h4–h6 share size, differentiated by weight and style).

## The scale

| Token | Computed | Used for |
|---|---|---|
| `--s-2` | 0.694rem | small UI / meta (rare) |
| `--s-1` | 0.833rem | captions, footnotes |
| `--s0`  | 1rem     | body |
| `--s1`  | 1.2rem   | h4, h5, h6, lede |
| `--s2`  | 1.44rem  | h3 |
| `--s3`  | 1.728rem | h2 |
| `--s4`  | 2.074rem | h1 |
| `--s5`  | 2.488rem | layout spacing only — not type |
| `--s6`  | 2.986rem | layout spacing only — not type |

Largest type (`--s4`) ÷ smallest type (`--s-1`) = **2.49** — under the cap
with headroom.

## Implications

- **Home page can't billboard.** The largest type on home is h1 (`--s4`,
  ~33px at base). Aligns with the plan's existing rejection of marketing
  registers.
- **Code editors are exempt.** CodeMirror's editor handles its own sizing;
  magnifier users zoom code separately from prose.
- **Fluid base preserved.** The ratio between sizes is what matters and is
  preserved at every viewport width. `:root { font-size: calc(1rem +
  0.25vw); }` scales the whole thing without disturbing the ratios.
- **Spacing tokens may exceed 3:1.** `--s5` and `--s6` exist for layout
  spacing values (margins, padding, gaps) where the 3:1 cap doesn't apply.
  They are not used as type sizes.

## Colophon line

> The type scale uses a ratio of 1.2 (minor third), chosen so that the
> largest and smallest text on any page differ by no more than 3:1. This
> means screen-magnifier users do not have to adjust zoom level when moving
> between headings and body text — both fit in the magnified viewport at
> usable size simultaneously.
