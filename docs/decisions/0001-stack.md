# 0001 — Initial stack

**Date:** 2026-05-05
**Status:** Accepted

## Choices

- **Framework:** Next.js 16 (App Router) on Node 20.
- **Language:** TypeScript.
- **Package manager:** npm. Default, zero defensibility burden, sufficient for a single-developer single-repo project.
- **Database:** MongoDB. Locally via Homebrew (`mongodb-community@7.0`); production will be OVH managed MongoDB at Gravelines (free tier).
- **Search:** OpenSearch (Apache Lucene 9.x via OpenSearch 3.6 bundling Lucene 10.4). Locally via Homebrew, production self-hosted on the OVH VPS.
- **Styling:** CSS Modules (Next.js default without Tailwind). Hand-written CSS.
- **Linting:** ESLint with `eslint-config-next` defaults.
- **Local services:** Homebrew (`brew services`). No Docker.

## Rejected

- **Meilisearch / Typesense / Tantivy** — not Apache Lucene. The requirement is a
  Lucene-backed engine for both technical durability and the brand value of
  saying so publicly.
- **Elasticsearch** — also Lucene, but the SSPL/Elastic-License situation is
  worth avoiding for an Apache-2.0-end-to-end story. OpenSearch was forked
  precisely to keep the Apache license.
- **Tailwind CSS** — utility-first styling is fine but harder to defend on a
  site whose design choices will be publicly discussed. Hand-written CSS keeps
  the design honest. Revisable if it becomes a productivity drag.
- **pnpm** — disk efficiency and strict dependency resolution don't materialise
  at single-project scale; "I used npm" needs no explanation.
- **Docker / docker-compose** — disallowed on this machine. Brew services serve
  the same role natively.

## Accessibility implications

- The "no JavaScript" constraint of the prior Flask CMS does **not** carry over:
  the new site has interactive surfaces (Playground, search-as-you-type) that
  require JS. The accessibility approach instead is "rich JS done accessibly":
  ARIA combobox patterns, focus management, live-region announcements, full
  keyboard support, screen-reader testing.
- CSS Modules give scoped styles without runtime JS, so design choices can be
  reviewed in plain CSS rather than scanned across utility-class soup.
