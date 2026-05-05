# 0005 — Zonal surface tinting

**Date:** 2026-05-05
**Status:** Accepted

## The choice

The site's surface colour shifts subtly by content category. Four zones,
each a different hue, all sitting at perceptually identical OKLCH lightness
so body-text contrast is preserved everywhere.

| Zone | Routes | Hue | Chroma | Feel |
| --- | --- | --- | --- | --- |
| `self` | `/`, `/about`, `/now`, `/contact`, `/work` | 85° | 0.04 | warm cream — paper |
| `writing` | `/writing`, `/writing/[slug]`, `/talks` | 30° | 0.05 | warm rose — editorial |
| `knowledge` | `/writing/reading`, `/writing/glossary`, `/research` | 230° | 0.045 | cool blue — archive |
| `tools` | `/paradise`, `/playground` | 215° | 0.015 | technical neutral |

## Why

Inspired by **BridgePoint** (the Shlaer-Mellor xtUML modelling tool), which
tinted different diagram types — Component, Class, State, Action — at low
saturation so the user's "where am I" question was answered without
chrome or labels. Almost no public-facing site does this, partly because
doing it well is technically constrained (must preserve text contrast
everywhere) and partly because flat brand palettes are the conventional
default.

For a content-heavy site that traverses categorically different intellectual
surfaces — long-form essays, paper-review database, working software tools
— the BridgePoint pattern fits. It also reads as a quiet design-craft
signal in the colophon.

## Implementation

Routes are organised into Next.js route groups by zone:
`(site)/(self)/`, `(site)/(writing)/`, `(site)/(knowledge)/`,
`(site)/(tools)/`. Each zone group's layout wraps its children in a
`<SiteShell zone="...">` component which renders a top-level
`<div className="site-shell" data-zone="...">` containing header, main,
and footer. The whole shell — chrome and content — paints in the zone's
tint, matching the BridgePoint pattern faithfully.

Each zone overrides `--hue` and `--chroma`. Surface and ink tokens in
[tokens.css](../../src/styles/tokens.css) derive from those two custom
properties via OKLCH:

```css
--surface-1: oklch(95% var(--chroma) var(--hue));
--surface-2: oklch(90% var(--chroma) var(--hue));
--ink:       oklch(20% 0.02 var(--hue));
--ink-muted: oklch(35% 0.02 var(--hue));
```

The shell's body uses `--surface-1` (the lighter zone tint); header and
footer use `--surface-2` (slightly more emphasised), banding the page top
and bottom. Cards within main (`.door`, `.box`) also use `--surface-2`,
giving them a tonal lift against the lighter page background. This is the
"tints within the group" texture.

In dark mode, the lightness values flip (surface to L=20%/26%, ink to
L=96%) and the same hue/chroma per zone applies.

No JavaScript, no flash-of-wrong-colour — the zone is set server-side
through the layout tree.

## Why OKLCH and not HSL or sRGB

OKLCH lightness is perceptually uniform — `oklch(98% c h)` looks equally
light to the human eye regardless of hue. HSL's lightness is mathematical
not perceptual; a yellow at HSL `L=50%` looks much brighter than a blue at
the same lightness. For a system that depends on body-text contrast holding
across four hues, perceptual uniformity is load-bearing.

## Calibration

The first attempt used chroma values in the 0.005–0.014 range with
surface lightness at 98%. The result was unusable — the tints were so
subtle they were imperceptible. Rebuilt with the values in the table
above (chroma 0.04–0.05 for tinted zones, 0.015 for the deliberately
neutral tools zone) and surface lightness at 95%/90%. Tints are now
clearly perceptible while remaining quiet enough not to read as
branding.

## Contrast verification

The OKLCH lightness pairings (95% surface ↔ 20% ink in light; 20%
surface ↔ 96% ink in dark) target around 11–12:1 contrast — comfortably
above AAA's 7:1 even at the highest chroma. Values should still be
verified with a contrast checker once the site is live and fonts have
rendered, since real-world contrast depends on font rendering, sub-pixel
anti-aliasing, and the user's display gamut.

## Zone count

Four was chosen as a tractable number — large enough to communicate
"different kinds of content," small enough to maintain. BridgePoint had
four diagram types. A fifth zone is a one-line addition if the IA grows
to need it.
