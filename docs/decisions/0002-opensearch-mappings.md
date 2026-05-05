# 0002 — OpenSearch index design (v1)

**Date:** 2026-05-05
**Status:** Accepted (foundation; synonyms layer deferred)

## Choices

### Three indexes, not one

`reviews`, `glossary`, `articles` are separate indexes rather than a single
combined `content` index. Reasons:

- Different field structures and different relevance weighting per corpus.
- Per-corpus analyzer/synonym tuning becomes possible later without touching
  the others.
- Reindexing one corpus does not affect the other two.
- OpenSearch's multi-index search syntax (`/reviews,glossary,articles/_search`)
  gives a single ranked result set when site-wide search is needed.

### English-language analyzer with stemming and ASCII folding

A custom analyzer named `a11y_text` is applied to all `text` fields:

```
standard tokenizer
→ lowercase
→ asciifolding
→ english_stop
→ english_stemmer (Porter)
```

Reasons:
- Porter stemmer collapses morphological variants ("accessible" matches
  "accessibility"), which is what readers expect.
- `asciifolding` handles diacritics defensively (citing French and German
  research is common in this corpus).
- `english_stop` removes the usual stopwords; stop removal is fine here because
  the corpus is large enough for term-frequency to do its job.

### Multi-field mappings for headline strings

`title`, `term`, `publication` all get both `text` (for analyzed search) and
`.keyword` (for sorting and aggregating). `ignore_above` prevents pathological
long values from breaking the keyword side.

Tag-like arrays — `tags`, `category`, `standards_referenced`, `related_terms`,
`authors`, `sources` — are pure `keyword`. Faceting and exact filtering, no
analysis.

### Field weighting for search

Initial weights, refinable as the corpus is searched in anger:

- `term^4` (glossary primary key)
- `title^3` (review/article primary key)
- `aka^3` (glossary aliases)
- `definition^2` / `summary^2`
- everything else `^1`

### Drop-and-recreate reindex

`npm run index` drops the index if it exists and recreates from Mongo. Fast at
this scale (~10s for ~9,300 docs). Alias-with-zero-downtime swap is overkill
until the site is live.

## Deferred

- **Glossary-driven synonym expansion (WCAG ↔ Web Content Accessibility
  Guidelines).** The 6,660 `aka[]` arrays are a goldmine for a `synonym_graph`
  filter at query time. Deferred because: (a) the file-path coupling between
  the indexer and the OpenSearch config dir is ugly, (b) regeneration on every
  glossary change needs thinking, (c) the foundation works without it. Plan to
  revisit once the writing surface and search UI are real.
- **Per-corpus tuned analyzers.** Glossary terms are short; review summaries
  are long. They could profit from different stemmer aggressiveness. Wait
  until search behaviour reveals a need.
- **`function_score` with year decay.** Newer papers might deserve a small
  boost. Wait for evidence the default ranking is wrong.

## Disk-watermark workaround on macOS

OpenSearch's flood-stage disk watermark fired immediately on first index
creation because macOS APFS reports snapshot-inflated disk usage (97%) even
though real free space is fine. Fix:

```sh
curl -X PUT 'http://localhost:9200/_cluster/settings' \
  -H 'Content-Type: application/json' \
  -d '{"persistent":{"cluster.routing.allocation.disk.threshold_enabled":false}}'
```

This is a local-dev-only setting; production OVH VPS will leave the threshold
on (the snapshot weirdness is macOS-specific). Captured here so the next dev
machine doesn't lose half an hour to it.

## Accessibility implications

None at the index layer. Search relevance and result presentation are the a11y
surfaces — keyboard navigation through hits, live-region announcement of result
counts, focus management as the user pages through results. Those decisions
land when the search UI is built.
