# 0005 — Zonal surface tinting

**Date:** 2026-05-05 (initial 4-zone version); amended 2026-05-15
to 11 zones (one per main-nav landing) after the four-zone shape
collapsed multiple main-nav landings into the same colour — most
visibly Paradise / Tools / Playgrounds / Maps sharing 215°, and
Writing / Talks / About sharing 30° (the Talks zone has since been
temporarily withdrawn alongside the page; see the note under the
table). The four-zone version is
preserved in git history at commit `00d867f^`.

**Status:** Accepted

## The choice

The site's surface colour shifts subtly per main-nav landing page.
Ten zones, each a different hue, all sitting at perceptually
identical OKLCH lightness so body-text contrast is preserved
everywhere. Sub-pages inherit their landing page's zone via their
section layout.

| Zone | Main-nav landing | Sub-pages (inherit) | Hue | Chroma | Feel |
| --- | --- | --- | --- | --- | --- |
| `about` | `/about` | — | 350° | 0.03 | mauve heather — personal |
| `writing` | `/writing` | `/writing/[slug]`, `/writing/reviews`, `/writing/glossary` | 30° | 0.05 | warm rose — editorial |
| `home` | `/` | — | 85° | 0.05 | warm cream — front door |
| `work` | `/work` | — | 130° | 0.045 | sage green — practitioner |
| `maps` | `/maps` | `/maps/*` | 155° | 0.045 | forest green — geographic |
| `tools` | `/tools` | `/carnforth`, `/automated-testing`, `/lived-user-testing` | 190° | 0.04 | teal — practical |
| `paradise` | `/paradise` | `/paradise/*` | 215° | 0.04 | cool slate — technical |
| `research` | `/research` | `/research/*` | 250° | 0.045 | cool blue — archive |
| `ambient` | (none) | `/now`, `/contact`, `/privacy`, `/accessibility`, `/colophon` | 270° | 0.012 | near-neutral cool grey — utility |
| `playgrounds` | `/playgrounds` | `/playgrounds/*` | 305° | 0.045 | lavender — experimental |

*The `talks` zone (60°, honey/wheat) was provisioned in the
2026-05-15 11-zone amendment for the `/talks` landing, and removed on
2026-05-16 when the `/talks` page was temporarily withdrawn pending
fresh content. Both the page and the zone will be reinstated together
when the content is ready; the gap at 60° in the table above is the
placeholder.*

*The `about` zone was shifted on 2026-05-16 from `5° / 0.045`
(dusty rose-pink) to `350° / 0.03` (mauve heather). The trigger was
the editorial portrait on the About page: its near-white studio-grey
backdrop fought the warmer pink. Cooling the hue toward mauve and
dropping chroma a notch lets the photo's neutral background read as
quiet rather than clashing, while staying inside the "personal" feel
the zone was assigned for. Spacing against the next-warmer zone
(`writing` at 30°) widens from 25° to 40°, so the two remain
distinguishable.*

## Why

Three motivations layered.

**1. Pale, not stark.** Body text on pure white is harsh for sustained
reading. The low-vision recommendation that recurs across AT practice
is closer to "cream surface, dark grey text" — softer than pure black-
on-white, easier on prolonged use. The site doesn't enforce that
specific palette (visitor preference via `prefers-color-scheme` and
`prefers-contrast` overrides whatever the site says), but the default
surface sits at 95% OKLCH lightness rather than pure white (100%) and
the default ink at 20% lightness rather than pure black. The starting
point is gentler than the conventional defaults, before any tint is
applied on top.

**2. Tinting for orientation, never for information.** Inspired by
**BridgePoint** (the Shlaer-Mellor xtUML modelling tool), which tinted
different diagram types — Component, Class, State, Action — at low
saturation so the user's "where am I" question was answered without
chrome or labels. The same affordance fits a content site that
traverses categorically different intellectual surfaces — long-form
essays, paper-review database, working software tools, biographical
pages. Critically, nothing on the site requires perceiving the tint to
use it. The colour is a way-finding cue layered on top of structure
that already works without it; visitors with colour-vision deficiencies,
high-contrast user stylesheets, or `prefers-contrast: more` engaged see
no information loss, only a flattened palette.

**3. Identical luminance across every zone.** Low-vision users
navigating between sections of the site should not have to re-adjust
their display brightness or screen-magnifier contrast settings as they
move from one zone to another. So while hue and chroma vary per zone,
lightness is held constant: 95% surface / 20% ink in light mode, 20% /
96% in dark. Body-text contrast ratio is therefore identical on every
page; only the hue of the underlying surface shifts. OKLCH's perceptual
uniformity makes the constraint trivially enforceable across ten
different hues — a property HSL and sRGB do not provide.

Almost no public-facing site does this. Doing it well is technically
constrained (must preserve text contrast everywhere), and flat brand
palettes are the conventional default. For a content-heavy site whose
pages serve categorically different purposes, the BridgePoint pattern
fits — and the identical-luminance constraint is what makes the system
work *for* low-vision navigation rather than against it.

## Implementation

Each main-nav landing has its own `layout.tsx` at its section root
(e.g. `(site)/(tools)/paradise/layout.tsx`) which wraps its children
in a `<SiteShell zone="...">` component. SiteShell renders a top-level
`<div className="site-shell" data-zone="...">` containing header,
main, and footer. The whole shell — chrome and content — paints in
the zone's tint, matching the BridgePoint pattern faithfully.

The four umbrella route groups (`(self)`, `(writing)`, `(knowledge)`,
`(tools)`) survive as folder-organisation only; they no longer carry
layouts. Inside `(self)` the home page and the ambient pages live in
their own nested route groups (`(home)`, `(ambient)`) so they can
have distinct layouts despite sharing the same URL prefix.

Each zone is a `[data-zone="..."]` attribute selector in
[tokens.css](../../src/styles/tokens.css) that sets the surface, ink
and rule tokens explicitly with literal OKLCH values for that zone's
hue and chroma:

```css
[data-zone="paradise"] {
  --surface-1: oklch(95% 0.04 215);
  --surface-2: oklch(90% 0.04 215);
  --ink:       oklch(20% 0.02 215);
  --ink-muted: oklch(35% 0.02 215);
  --rule:      oklch(75% 0.04 215);
}
```

An earlier draft chained the surface tokens through `--hue` /
`--chroma` custom properties (`oklch(95% var(--chroma) var(--hue))`).
The chained form is defensible CSS but resolves unreliably across
browsers — notably Safari — when the inner vars are overridden on a
descendant. Baking the OKLCH values explicitly per zone is more
verbose but bulletproof.

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

The original 2026-05-05 version of this decision committed to **four
zones** — "large enough to communicate different kinds of content,
small enough to maintain." That target turned out to be too small for
the site's information architecture: nine items live on the main nav,
and the four-zone shape collapsed Paradise, Tools, Playgrounds, and
Maps into one colour, plus Writing, Talks, and About into another (Talks
has since been temporarily withdrawn). A
visitor moving between Paradise and Maps in the same browsing session
saw the same surface tint both places — the BridgePoint "where am I"
signal stopped working at exactly the resolution that matters most.

The amendment (2026-05-15) makes the unit of tinting the **main-nav
landing page** rather than an umbrella category. Eleven zones in
total: nine for the main-nav items, one for the home page, one
near-neutral "ambient" zone for the utility pages off the footer.

Eleven is technically a lot of hues to maintain. Two things make it
tractable:

- OKLCH's perceptual uniformity means contrast against `--ink` is
  hue-independent — every zone hits the same ~11:1 just by virtue of
  using L=95% surface and L=20% ink. Adding a zone is one hue value,
  not a contrast-tuning exercise.
- The hues are spaced at least 25° apart on the colour wheel, with
  the near-neutral ambient zone using very low chroma (0.012) so it
  reads as utility-grey rather than competing with its neighbours.
  The closest hue pair on paper (research 250° / ambient 270°) reads
  as visually distinct because their chromas are an order of
  magnitude apart.

If the IA grows beyond eleven main-nav-adjacent zones, the question
of when the colour vocabulary stops scaling becomes real. For now it
holds.
