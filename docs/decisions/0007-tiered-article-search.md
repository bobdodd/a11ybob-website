# 0007 — Tiered relevance scoring for full-text search

**Date:** 2026-05-06
**Status:** Accepted. Applied to articles, reviews, and glossary.
Originally accepted on articles only; extended to reviews and glossary
once the article behaviour was verified.

## The pattern

For a multi-term query against the articles index, three `should`
clauses contribute to the document score, with descending boosts:

```text
boost   clause                     matches a doc when…
─────   ────────────────────────   ────────────────────────────────────
  10    multi_match phrase         the exact phrase appears in title
                                   or content
   4    multi_match best_fields    every term in the query appears
        operator: and              (in some field, anywhere)
   1    multi_match best_fields    at least one term appears (default)
```

A document matching multiple tiers compounds. A phrase match satisfies
all three clauses → highest score. A doc with both terms but not
adjacent satisfies tiers 2 and 3 → middle score. A doc with only one
term satisfies just tier 3 → lowest score.

`minimum_should_match: 1` ensures filtering-only queries (no scoring
clauses match) return zero results rather than every document at score 0.

## Why three tiers, not two

Two tiers (phrase / OR) was an option. Three is the Solr/Lucene
classical model and behaves better when one term in a multi-word query
is much more common than the other. Without the AND tier, an article
that mentions *music* a hundred times but never *braille* could outrank
an article that mentions both *braille* and *music* once each — clearly
the wrong answer for the query *braille music*. The AND tier corrects
that.

## Boost ratios

10 / 4 / 1. The 10× phrase boost is high enough that any phrase match
ranks above any non-phrase match in practice. The 4× AND boost gives
both-terms-present a clear lift over single-term hits without overwhelming
relevance signals from frequency or field weighting (`title^3` still
applies inside each clause).

These ratios are tunable. The current values were chosen by analogy to
Solr defaults rather than empirical tuning of this specific corpus. Worth
revisiting if results feel off once Bob has used the search in anger.

## Surfacing the tier in results

Each `should` clause is given a `_name` (`phrase`, `all`, `some`), and
OpenSearch returns `matched_queries` per hit. The result card shows the
highest tier matched as a label: *Exact phrase*, *All terms*, or *Some
terms*. Raw `_score` is intentionally not shown — it's a unitless BM25
value that doesn't compare meaningfully across queries. The tier label
maps directly to a distinction a reader can act on.

For single-term queries the label is suppressed: with one token, all
three clauses match the same documents, so the distinction carries no
information.

## What this does not do

- **It does not filter by phrase.** A doc that contains only one term
  still appears, just lower. If you want phrase-only results,
  quoted-phrase syntax with strict filtering would be a separate
  feature. Not currently planned — the tiered ranking is good enough for
  the use case.
- **It does not affect highlighting.** [`getArticleHighlights`](../../src/lib/articles.ts)
  uses a simpler default `multi_match` so that every individual
  occurrence of every query term gets highlighted in the article reader,
  regardless of which tier matched.
- **It does not change which fields each corpus searches.** Articles
  search `title^3, content`. Reviews search
  `title^3, summary^2, key_findings^2, relevance, tags, authors`.
  Glossary searches `term^4, aka^3, definition^2`. The tiering applies
  across whichever fields the corpus uses.

## Stemming caveat

The English analyser stems the query before matching. *braille music*
analyses to roughly `["braill", "music"]`. So the phrase clause matches
`braille music's`, the OR clause matches `musical` (stems to `music`),
and so on. This is generally what users want. If literal-string matching
is ever required (for code identifiers, proper nouns, etc.) it would
need a separate not-analysed sub-field on the relevant fields.
