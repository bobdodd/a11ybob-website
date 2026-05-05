# a11ybob.com

The source of [a11ybob.com](https://a11ybob.com), Bob Dodd's personal site on
digital accessibility — long-form writing, a literature-review database of
research papers, a glossary, and an in-browser accessibility playground.

The site is itself a portfolio piece. Every meaningful design and
implementation decision is documented in [`docs/decisions/`](docs/decisions/) and
will eventually be linked from the site's colophon.

## Stack

- Next.js 16 (App Router) on Node 20, TypeScript, npm.
- MongoDB for content (database `a11y_paradise`; collections `reviews`,
  `glossary`, `articles`).
- OpenSearch (Apache Lucene) for full-text search.
- Vanilla CSS organised in `@layer` groups, with design tokens as CSS custom
  properties. Layout primitives adapted from
  [Every Layout](https://every-layout.dev) by Heydon Pickering and Andy Bell.

## Running locally

Both backends run as Homebrew services (no Docker):

```sh
brew install mongodb-community@7.0 opensearch
brew services start mongodb-community@7.0
brew services start opensearch
```

Defaults out of the box:

- MongoDB: `mongodb://localhost:27017`
- OpenSearch: `http://localhost:9200` (no auth — security plugin not installed)

Then:

```sh
npm install
npm run dev
```

Visit [`/health`](http://localhost:3000/health) to confirm both backends are
reachable, and [`/styleguide`](http://localhost:3000/styleguide) for the design
system.

## Environment

Copy `.env.example` to `.env.local` and adjust if needed. The defaults work
against the local Homebrew services.

## Scripts

- `npm run dev` — Next.js dev server.
- `npm run build` / `npm run start` — production build / serve.
- `npm run lint` — ESLint.
- `npm run seed` — load MongoDB from a JSON backup. Set `BACKUP_DIR`
  to point at a directory containing `backup_YYYYMMDD_*.json` files;
  defaults to `./backups`.
- `npm run index` — build OpenSearch indexes (`reviews`, `glossary`,
  `articles`) from the seeded MongoDB.
- `npm run import-articles` — one-shot import of long-form Markdown drafts
  into the `articles` collection. Set `ARTICLES_SOURCE_DIR` to point at
  the directory containing the .md files.

## License

[GPL-3.0-only](LICENSE). Issues and pull requests welcome.
