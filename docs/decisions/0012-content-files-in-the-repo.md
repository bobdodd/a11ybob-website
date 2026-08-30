# 0012 — Long-form content lives in the repo as files

**Date:** 2026-08-30
**Status:** Accepted
**Builds on:** [0003](0003-articles-schema-and-versioning.md) (article schema and
versioning, unchanged) and [0011](0011-push-before-deploy.md) (the repo is the
source of truth).

## What this replaces

Publishing an Experience piece or a research essay meant copying a
`scripts/tmp-insert-<something>.ts`, editing the slug, title, tags,
`publishedAt` and `originUrl`, and running it. There were sixteen such scripts.
They were gitignored (`scripts/tmp-*.ts`), so:

- **Nothing was a record.** Slug, tags and publication dates for sixteen
  published pieces existed only in Mongo and in untracked files on two machines.
- **Nothing was reviewable.** ~36 of each script's ~60 lines were identical
  Mongo boilerplate; 24 differed. That is why `originUrl` was simply missing
  from one until it was noticed by hand — no shape made an absent field obvious.
- **One piece had no file at all.** `tmp-insert-experience-repair.ts` was 16 KB
  because it carried its entire body INLINE. The AI-code-repair article existed
  in Mongo and in one untracked script, and nowhere else.
- **Nothing was validated.** Every content bug of the preceding month was
  catchable: a markdown table that silently does not render, mojibake from a
  hand-off, a cover image that was never committed.

## Choice

One file per piece, in the repo:

```
content/experience/<slug>.md
content/article/<slug>.md
```

YAML front matter for the publication metadata, markdown body below it. **The
filename is the slug**, so a slug cannot disagree with the record of it.

```yaml
---
title: 'How steep is this path? Adding gradient data accessibly to digital maps'
publishedAt: '2026-08-06'
originUrl: 'https://www.linkedin.com/pulse/how-steep-path-…'
originLabel: 'LinkedIn'
tags:
  - 'accessibility'
  - 'maps'
---
```

Four tracked scripts replace the sixteen:

| script | does |
|---|---|
| `scripts/content-file.ts` | the format: parse, render, validate |
| `scripts/publish-content.ts` | `<file>` or `--all`, `--check` — files to Mongo |
| `scripts/export-content.ts` | Mongo to files; read-only, bootstrap and audit |
| `scripts/roundtrip-check.ts` | proves the format is lossless |

### Published only

The repo is **public**, so `export-content.ts` writes published documents only.
Drafts stay in Mongo, where 0003's draft/published toggle expects them. Draft
work must not appear on GitHub because of a tooling convenience.

One consequence to hold: an unpublished piece has no file, so its metadata is
not in the repo either. The superseded scripts are archived outside the repo for
exactly this reason — one covers a piece that is still a draft.

### Validation refuses before it writes

`publish-content.ts` validates **every** file before writing **any**, and one
error stops the run. A half-applied corpus is worse than a refused one: the
failures are missing images and tables that will not render, invisible on the
server and obvious to a reader.

Errors: unparseable front matter, a slug that is not a slug, a missing or
unparseable `publishedAt`, an unknown front-matter key, an empty body,
`originLabel` without `originUrl`, a markdown table (no `remark-gfm`, so it
renders as literal pipes), a referenced image absent from `public/`, empty alt
text, and mojibake.

Warnings, never refusals: no tags, em-dashes in the body, first-person plural.

### `allowMojibake`, and why it is a string

The mojibake check is an error, not a warning, because the one time corrupted
text arrived in a hand-off it would have gone through an entire cached system
prompt unnoticed. But it is not always a defect:
`local-ai-models-to-evaluate-web-pages` quotes a language-detection model
**verbatim**, and the mangled characters are planted defects in the test page it
was reading — the paragraph after the quotation says so and discusses them.
Correcting them would falsify the quotation and delete the article's point.

So the check stays hard and the exemption is per file, as a **string carrying
the reason**, not a boolean. A bare flag records that someone silenced a check;
a sentence records why, in a diff, next to the prose it applies to.

### Articles keep their versioning

0003 is untouched. `publish-content.ts` creates a new `article_versions`
document only when the body **actually differs** from the current version, so
`--all` is idempotent and does not manufacture history. Metadata-only edits
update the article document alone.

The comparison is trimmed-to-trimmed. The first `--all` across the corpus
compared a trimmed file body against untrimmed stored content and minted
eighteen versions whose only change was whitespace. Same content must mean same
version, or `--all` fills the history with noise. (Those eighteen remain: they
record a real, if trivial, change to what is stored, and deleting version rows
from production to tidy up is a worse act than leaving them.)

## Rejected

- **A manifest** (`content/experiences.json`) with content files staying
  outside the repo. Records the metadata but not the content, so the repo still
  could not rebuild the site — and a manifest drifts from the files it names.
- **Export-only.** Cheapest, keeps Mongo authoritative, but fixes the record
  without fixing the process and makes the repo a mirror rather than a source.
- **Downgrading the mojibake check to a warning** so the one legitimate case
  passes. It would have made the check useless for the case it exists for.

## Verified

- **Lossless.** Mongo to files to Mongo to files produces byte-identical output.
- **Idempotent.** Two consecutive `--all` runs create zero new versions.
- **Deterministic.** `render()` uses `forceQuotes`, because the bootstrap export
  ran on the VPS against js-yaml 4.1.1 while the Mac had 5.4.1 and the two
  disagreed on when a scalar needs quoting — enough to fail all 32 files.
  `roundtrip-check.ts` exists to catch exactly that.

## Accessibility implications

The validator's error list is an accessibility checklist in disguise. A missing
image publishes a broken figure whose alt text still reads as complete to a
screen reader — visibly broken to a sighted reader, silently fine to a blind
one, which is the worst possible split. Empty alt text and unrendered tables are
the same class. These now cannot reach the site.

## Note for the deploy

Adding `js-yaml` as a direct dependency exposed that **the deploy has never run
`npm install`** — it rsyncs and runs `npm run build`. `js-yaml` worked on the box
only because it was already present transitively. A genuinely new dependency
would fail there and not locally. It was installed by hand this time; the deploy
sequence should run an install when `package.json` changes.
