# 0013 — The AFDS section lives under Adaptation

**Date:** 2026-08-30
**Status:** Accepted
**Builds on:** [0004](0004-design-system-principles.md) (design system
principles, and Every Layout as the layout foundation) and
[0005](0005-zonal-tinting.md) (zonal surface tinting, which the section inherits
without new work).

## What this is for

The Accessibility Focused Design System (AFDS) work is developed in a separate
repository, [bobdodd/accessible-by-design](https://github.com/bobdodd/accessible-by-design),
GPL-3.0-only for code and CC BY-SA 4.0 for documentation. That repository holds
the research and the draft specification. This decision covers only how the work
is **recorded on a11ybob.com**: where it sits, what shape it takes, and which
artefacts are canonical here rather than there.

The framing matters, because the first draft of the section got it wrong. An
AFDS is not a description of an interface. A capability model says what a person
can do and a preference model says what they would rather, and those, together
with the needs of the application, drive design decisions for the user
interface. A design system describes the *outcomes* of those decisions, setting
rendering and interaction rules and often building a hierarchy of components and
layout strategies. The accessibility-focused ones cover multiple forms of user
interaction, which is what "modalities" means in the section title.

## Choice

### A section under Adaptation, not a tenth nav zone

`/adaptation/afds`, a hub with sub-pages, inside the existing `(adaptation)`
route group. The primary nav stays at nine items.

The zone is right on the merits rather than only on nav economy. Adaptation
already carries the two halves of the description problem, `describing-people-to-computers`
(capability) and `describing-what-people-want` (preference). The design system is
what those two feed into. Placing it third in the index order, after preference
and before personas, makes the three read as a run.

Inheriting the group also means the amber adaptation tint, the `SiteShell`, and
the theme-colour sync all apply with no new code, per 0005.

### Slug `afds`, not `describing-interfaces-and-modalities`

The nav label and the `h1` both carry the full phrase; the URL does not need to
repeat it. `afds` is short and stable.

There is a design-system reason too. The site sets `a { white-space: nowrap }`
globally so multi-word link text cannot wrap mid-link. A long slug is a real
layout hazard the moment a URL is ever rendered as its own link text, which is
exactly what happens in citations and in the colophon's own decision list.

### The hub-and-sub-nav pattern, not one long page

`AfdsSubNav` follows `TetrisSubNav` and `ParadiseSubNav` exactly: a client
component reading `usePathname()`, a `SUB_PAGES` const, `nav.section-nav` with a
`.section-nav__label` and a `.nav-list.cluster`, and `aria-current="page"` on the
active item. Label: "In this design system". It renders on the hub and on every
sub-page, and it lists only pages that exist.

Eight pages: Introduction, Why a design system, What a component declares,
Evidence and uncertainty, The package format, Adapters, User guide,
Specification. Reference material sits at the end, matching the Tetris case
study's ordering.

### The user guide and the specification are hosted here

Both live in the section rather than only in the other repository. The
specification is an **HTML page**, at `/adaptation/afds/specification`, and that
page is canonical.

The draft exists as `AFDS-Draft-Specification-v1.0.0.docx`. A Word file cannot
meet this site's AAA contrast floor, cannot be linked to by section, and cannot
be read without an application. A specification that is hard to quote is a
specification that will not be quoted.

### One specification page for now

Thirteen headings: a status note plus twelve numbered clauses. Splitting a
specification across pages commits to stable per-section URLs, and those should
not be fixed before the specification itself has settled. It will be split if it
outgrows a single page, which is the depth-split practice the colophon already
describes.

## Rejected

- **A tenth top-level nav zone.** Nine items is already a lot, and it would cut
  AFDS off from the capability and preference work it depends on.
- **`describing-interfaces-and-modalities` as the slug.** More legible cold, but
  long, and it duplicates what the `h1` already says. See the `nowrap` hazard
  above.
- **The `.docx` as the canonical specification.** Fails AAA, unquotable, and
  unlinkable by section.
- **Splitting the specification into numbered sub-pages now.** Premature; it
  would fix section URLs before the content is stable.
- **Publishing the section as content files** under `content/article/`, per 0012.
  Rejected because these are structural pages with a persistent sub-nav and a
  hub index, not long-form pieces in a searchable corpus. 0012 governs the
  Writing corpora; coded pages remain right for zonal structure.
- **A downloads directory** for the `.docx` and the sample `.afds` package. Not
  rejected on merit, only deferred: the site has no download convention at all
  today, and inventing one is its own decision. Revisit when the specification
  stabilises.

## Accessibility implications

The specification-as-HTML choice is the load-bearing one. It puts the normative
text under the same AAA contrast floor, the same fluid type scale, the same
`prefers-*` handling, and the same focus appearance as everything else. A `.docx`
would have been an accessibility hole in the middle of an accessibility
specification.

The sub-nav pattern was already exercised by Tetris, Paradise, Maps, and
Research, so it arrives with its keyboard behaviour and its `aria-current`
announcement proven rather than newly written. One `h1` per page, `h2` for
clauses, no skipped levels.

The cluster grows to nine links, matching the Tetris sub-nav's nine, so wrapping
at 320 CSS px should behave as it already does there. Worth confirming on the
narrow viewport rather than assuming.

## Note: two sitemap gaps found while doing this

`src/lib/sitemap-data.ts` was missing three pages that have been live for some
time: `adaptation/describing-people-to-computers`,
`adaptation/describing-what-people-want`, and `adaptation/personas`. The file's
own comment warns about precisely this drift, having lost 38 pages to it once
before. Fixed alongside the eight new AFDS paths, in its own commit.

`STATIC_PATHS` was then audited against every static route under
`src/app/(site)/`: 79 on disk, 79 listed, nothing missing and nothing stale.
Those three were the only gap.

Separately, and **not** fixed here because it is a judgement call rather than a
defect: the colophon's public decision list stops at 0008, while this file is
0013. Entries 0009 to 0012 cover production deployment, the production database,
push-before-deploy, and content-files-in-the-repo. Some of that may be
deliberately withheld as infrastructure detail. Whether 0009 to 0013 should be
surfaced publicly needs deciding rather than assuming.
