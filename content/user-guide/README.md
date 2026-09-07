<!--
SPDX-FileCopyrightText: 2026 Bob Dodd
SPDX-License-Identifier: CC-BY-SA-4.0
-->

# Generated user guide pages

Every `.md` file in this directory, and `contents.json`, is generated.
Do not edit them.

The AFDS user guide is written and maintained as one Markdown
document, `docs/AFDS-USER-GUIDE.md`, in the
[accessible-by-design](https://github.com/bobdodd/accessible-by-design)
repository. That document is the single source of truth. These files
are produced from it by `tools/site/build-guide-pages.py` in that
repository:

```
cd accessible-by-design
python3 tools/site/build-guide-pages.py ../a11ybob-website
```

They are committed here rather than fetched, so this site builds with
no dependency on the other repository.

## What the generator does

It splits the guide at its Part boundaries, gives every section
heading a stable anchor derived from its title, rewrites the Markdown
tables as the site's scroll-region table markup, because this site
does not load `remark-gfm` and a Markdown table would otherwise render
as literal pipes, wraps fenced code in a keyboard-reachable scroll
region, and turns the guide's inline clause citations into links into
the published specification. It changes no wording.

The clause links are resolved from
`content/specification/contents.json`, so the guide cannot cite a page
split the specification no longer uses, and a citation whose clause
cannot be resolved is left as plain text rather than guessed at. Run
`build-spec-pages.py` before this generator when both documents have
changed.

The guide is informative. It issues no requirement of its own, and
where it and the specification disagree the specification governs.

## Consuming them

`src/lib/user-guide.ts` reads `contents.json` and the page files.
`contents.json` drives both the table of contents on the user guide
landing page and the list in `GuideNav`, so neither is retyped and
neither can fall out of step with the document.

To change anything on these pages, change the guide and run the
generator again.
