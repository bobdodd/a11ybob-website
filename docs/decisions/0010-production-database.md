# 0010 — Production database: self-hosted MongoDB with authentication

**Date:** 2026-07-26
**Status:** Accepted
**Answers:** the open question left by [0008](0008-trial-deployment.md) and
restated in [0009](0009-production-deployment.md).

## What this is

[0008](0008-trial-deployment.md) chose self-hosted MongoDB 7.0 on the VPS *for
the trial*, and named OVH's managed MongoDB free tier as "the production
target", to be settled by a later production-deploy decision. That decision was
never written. [0009](0009-production-deployment.md) recorded the deploy
mechanism but explicitly did not answer the database question, flagging the
production database as undocumented.

It is now documented, and the answer is that nothing moved. **Production runs
on the self-hosted MongoDB installed during the trial.** The managed tier was
never adopted. This entry records the fact rather than a fresh choice: no
decision to stay self-hosted was ever taken, the migration simply did not
happen, and after months of production use the trial arrangement is the
production arrangement.

Recording it that way is the point. An intention stated in a decision log and
never revisited reads, months later, exactly like a decision that was made.

## What is actually running

- **Self-hosted MongoDB on the VPS**, reached at `127.0.0.1:27017`. Bound to
  loopback, as 0008 specified, so it is unreachable from outside the box
  independently of ufw.
- **Authentication is on.** The application connects as a dedicated,
  non-superuser account rather than as an admin user, with `authSource` set to
  the application database rather than `admin`, so the credential's authority is
  scoped to `a11y_paradise` alone. The account name is deliberately not recorded
  here; this log is source material for a public page.
- **Database:** `a11y_paradise`, holding the corpora the site serves, namely
  `reviews`, `glossary`, `articles`, `article_versions` and `experiences`.
- **The connection string lives only in `/home/ubuntu/a11ybob-website/.env.local`**
  on the server, which is deliberately excluded from the deploy rsync per
  [0009](0009-production-deployment.md). The local `.env.local` is a localhost
  stub with no credentials in it.

Worth noting the asymmetry with the other backend service. 0008 put Mongo and
OpenSearch behind the same loopback binding and disabled the OpenSearch
security plugin, reasoning that for a localhost-only single-app deployment its
overhead was pure cost. Mongo ended up with authentication anyway. Two locks on
one door and one on the other. That is defensible, since the database holds the
content and OpenSearch holds a rebuildable index of it, but it was not a stated
decision either, and it is recorded here as an observation rather than a
recommendation.

## Rejected, or rather never taken up

- **OVH managed MongoDB free tier.** 0008's objections to it for the trial
  (a TLS connection string, an IP whitelist, and an external dependency taken on
  before the app shape was known) have simply never been retested against
  production experience. Whether they still hold is an open question; what is no
  longer open is which database production uses.

## Operational notes (not decisions; reference)

- **The maintenance scripts do not load `.env.local`.** `scripts/index-opensearch.ts`
  and the `tmp-insert-*` scripts read `process.env` directly and fall back to
  `mongodb://localhost:27017` with no credentials, which fails against an
  authenticated server. Running any of them on the VPS means sourcing the file
  first: `set -a && . ./.env.local && set +a && npm run index`. The fallback
  defaults are correct for a local development machine and wrong for production,
  which is the more dangerous way round for a silent default to be.
- **`npm run index` prints the full connection string, credentials included,**
  to stdout on every run, where it lands in terminal scrollback and in any log
  that captures the command's output. Masking the password in that banner would
  cost one line and remove a standing credential-disclosure path.

## Accessibility implications

The corpora this database holds are the site's accessible content, not
decoration: the literature reviews, the glossary, and the long-form writing are
what the search surfaces are for. Availability and backup integrity are
therefore an accessibility concern rather than merely an operational one, since
a reader who relies on the search to navigate has no visual fallback of
scanning a page for the thing they wanted.

## Supersedes / superseded by

Answers the database question left open by 0008 and restated by 0009. Supersedes
0008's statement that managed Mongo is "the production target", which was an
intention rather than an outcome. Would be superseded by an actual migration
decision, should the managed tier ever be revisited.
