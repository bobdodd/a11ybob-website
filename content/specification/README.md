<!--
SPDX-FileCopyrightText: 2026 Bob Dodd
SPDX-License-Identifier: CC-BY-SA-4.0
-->

# Generated specification pages

Every `.md` file in this directory, and `contents.json`, is generated.
Do not edit them.

The AFDS specification is written and maintained as one Markdown
document, `docs/AFDS-SPECIFICATION.md`, in the
[accessible-by-design](https://github.com/bobdodd/accessible-by-design)
repository. That document is the single source of truth. These files
are produced from it by `tools/site/build-spec-pages.py` in that
repository:

```
cd accessible-by-design
python3 tools/site/build-spec-pages.py ../a11ybob-website
```

They are committed here rather than fetched, so this site builds with
no dependency on the other repository.

## What the generator does

It splits the document at its part boundaries, gives every clause
heading a stable anchor derived from its clause number, rewrites the
Markdown tables as the site's scroll-region table markup, because this
site does not load `remark-gfm` and a Markdown table would otherwise
render as literal pipes, wraps fenced code in a keyboard-reachable
scroll region, and turns internal clause and part references into
links to the page that now carries them. It changes no normative
wording.

Clause numbers are global and permanent within a version, so the split
into pages carries no meaning. Clause 23 is clause 23 on whichever
page it appears, and `#c23-2` is clause 23.2.

## Consuming them

`src/lib/specification.ts` reads `contents.json` and the page files.
`contents.json` drives both the table of contents on the
specification landing page and the list in `SpecNav`, so neither is
retyped and neither can fall out of step with the document.

To change anything on these pages, change the specification and run
the generator again.
