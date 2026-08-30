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

An earlier draft of this record said the specification existed as
`AFDS-Draft-Specification-v1.0.0.docx` and argued against Word on contrast and
linkability grounds. That was wrong about the source. `docs/AFDS-PACKAGE-FORMAT.md`
is canonical and `tools/docx/build.js` generates the `.docx` from it, so there
was never a Word-only original to argue against.

The real argument is simpler. The canonical text is already markdown, so the
site should render it as a page rather than link to a generated binary. That
gives it the AAA contrast floor, section anchors, and readability without an
application. A specification that is hard to quote is a specification that will
not be quoted.

### One specification page for now

Seventeen headings: a status note plus the source document's sixteen numbered
clauses. An earlier draft of this record said twelve, written before the source
had been read. Splitting a specification across pages commits to stable
per-section URLs, and those should not be fixed before the specification itself
has settled. It will be split if it outgrows a single page, which is the
depth-split practice the colophon already describes.

### Published at its current scope, not held back

The standard is intended to be a full definition of an Accessibility Focused
Design System. It is not one yet. Clause 1.2 of the source disclaims the
substance in its own words: it does not specify the internal schema of a
design-token file, and does not specify the internal schema of a component
specification beyond requiring that one exists and is machine-readable. What is
specified is the container.

That gap is already on the record in `docs/OPEN-QUESTIONS.md` in the other
repository, as A1 what the system contains, A2 component inventory, A3
composition conformance, and H1 the component-contract schema.

The page is published anyway, scoped honestly as the package format, carrying a
status note that says the container is specified and the component, token and
evidence schemas are still open. Holding the page until the standard is
substantial was considered and rejected: the source already states plainly that
it is a project draft, not a W3C standard and not on any standards track, so
publishing a draft as a draft is consistent, and a visible open-questions list
is truer to the project's own position that uncertainty is a first-class record
type than a hidden one would be.

## Rejected

- **A tenth top-level nav zone.** Nine items is already a lot, and it would cut
  AFDS off from the capability and preference work it depends on.
- **`describing-interfaces-and-modalities` as the slug.** More legible cold, but
  long, and it duplicates what the `h1` already says. See the `nowrap` hazard
  above.
- **Linking to the generated `.docx` instead of rendering the markdown.** Fails
  AAA, unquotable, unlinkable by section, and one step removed from the source.
- **Splitting the specification into numbered sub-pages now.** Premature; it
  would fix section URLs before the content is stable.
- **Holding the specification page until the standard is a full definition.** The
  source already declares itself a project draft, so publishing a draft as a
  draft is consistent. Deferred publication would also hide the open questions
  rather than surface them.
- **Expanding the standard first, before writing the section.** The definition
  work is real and has a written agenda, but it is research with no settled end
  date, and the teaching material does not depend on its outcome.
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

## Note: two record gaps found while doing this

`src/lib/sitemap-data.ts` was missing three pages that have been live for some
time: `adaptation/describing-people-to-computers`,
`adaptation/describing-what-people-want`, and `adaptation/personas`. The file's
own comment warns about precisely this drift, having lost 38 pages to it once
before. Fixed alongside the eight new AFDS paths, in its own commit.

`STATIC_PATHS` was then audited against every static route under
`src/app/(site)/`: 79 on disk, 79 listed, nothing missing and nothing stale.
Those three were the only gap.

Separately, the colophon's public decision list had stopped at 0008 while this
file is 0013, so entries 0009 to 0012 had been written and never surfaced. That
was raised as a judgement call rather than a defect, because 0009 to 0011 cover
production deployment, the production database, and push-before-deploy, any of
which might reasonably be withheld as infrastructure detail. Bob's ruling was to
publish all of them, so 0009 to 0013 were added to the `decisions` array in
`colophon/page.tsx`.

0010 states in its own text that it is source material for a public page and
deliberately omits the account name. Its summary keeps that discipline: the shape
of the arrangement, loopback binding, authentication on, a scoped non-superuser
account, and none of the specifics.

The array and the directory now agree: thirteen entries, every `file:` reference
resolving under `docs/decisions/`, nothing on disk unlisted, ids ascending with
no gaps. Worth keeping checked, since this is the second list in the same repo
found drifting from the same directory it describes.
