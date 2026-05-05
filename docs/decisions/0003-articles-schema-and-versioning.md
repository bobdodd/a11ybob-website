# 0003 — Articles schema, draft/publish toggle, and versioning

**Date:** 2026-05-05
**Status:** Accepted

## Choices

### Two collections, not one

```
articles                          article_versions
─ _id                             ─ _id
─ slug              (unique)      ─ articleId         → articles._id
─ title             (snapshot)    ─ version
─ summary           (snapshot)    ─ title
─ status            draft|publ.   ─ summary
─ author                          ─ content
─ tags[]                          ─ sourceFile
─ domains[]                       ─ createdAt
─ currentVersionId  → versions    ─ notes
─ createdAt
─ updatedAt
```

Reasons:
- The article-list query stays cheap. Rendering an index doesn't pull
  multi-MB content blobs across the wire.
- Editing creates a new version document instead of rewriting the article on
  every save. Past versions become first-class queryable data.
- A clean place to attach edit-time metadata (notes, who-edited-when, source
  reference) without polluting the canonical article record.

Drawbacks accepted:
- Title and summary are snapshotted onto both the article and the version.
  The CMS save path must update both atomically. Worth the redundancy because
  it keeps the index query a single round trip with no joins.
- Two collections means a join on read for full content. Acceptable: only the
  current version is needed for public rendering; old versions are accessed
  rarely and on explicit request.

### Draft / published toggle

`articles.status: 'draft' | 'published'`. Public site queries filter
`status: 'published'`. The OpenSearch indexer does the same. Drafts are
invisible everywhere except the CMS.

Articles can move freely between states. Unpublishing means removing from the
public site and the search index without losing the data.

### Versioning

Every save in the CMS creates a new `article_versions` document with an
incremented `version`. `articles.currentVersionId` always points at the
version users see. Older versions remain queryable for history and recovery.

A version is content-only — title, summary, content, the source file it
originated from, and a free-form `notes` field. Status, tags, domains, and
authorship live on the article document and are not snapshotted per-version
(they change rarely and are not edits-of-content).

### Domains as an array

`domains: string[]`. Cardinality "many" because accessibility cuts across
disciplines and edge-cases need to be expressible without forcing a primary
classification. Empty by default — Bob will tag in the CMS.

`tags[]` remains separate as the free-form labelling surface; `domains[]` is
for the broader categorical buckets the writing archive surfaces.

## Implications elsewhere

- **OpenSearch indexer** ([scripts/index-opensearch.ts](../../scripts/index-opensearch.ts)):
  joins `articles` (filtered by `status: 'published'`) with
  `article_versions` on `currentVersionId`, then indexes the version content
  under the article's `_id`. Drafts and old versions are never indexed.
- **Migration script** ([scripts/migrate-articles.ts](../../scripts/migrate-articles.ts)):
  multi-version draft articles (music: 3, w4a: 2) are imported with each .md
  file as its own version, ordered chronologically.
- **`/health` page**: reports article counts by status. While everything is
  draft, the `articles` OpenSearch index reads as `0` — that's the publish
  toggle working as designed, not a bug.

## Indexes created

```
articles.slug                     (unique)
articles.status
article_versions.{articleId, version}  (unique)
```

The `articleId+version` unique constraint is the integrity guarantee that
every article version is unambiguous. Useful when the CMS save path becomes
real.

## Deferred

- **Authorship per version.** Currently `author` is article-level only. If the
  CMS becomes multi-user, version-level author becomes load-bearing.
- **Diff/blame surface.** The data is there; the UI to walk the version
  history is not built and isn't yet needed.
- **Soft-delete.** Currently delete removes a row. A `deletedAt` timestamp
  would let the CMS recover from accidents. Easy add later.
