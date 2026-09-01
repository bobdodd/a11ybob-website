# a11ybob.com — architecture and working guide

Written for a Claude session picking this site up on a second machine. It assumes
no prior context. Read it before changing anything.

Two documents already in the repo take precedence over this one where they
overlap: **`CLAUDE.md`** (working rules, in the repo root) and
**`docs/decisions/`** (numbered decision records). This guide explains the shape
of the system; those explain why it is that shape and what must not be broken.

---

## 1. What the site is

`https://a11ybob.com` is Bob Dodd's personal professional site: a senior
accessibility practitioner's body of work. It is not a brochure. **The site is
itself a portfolio piece** — it is expected to survive being audited by other
accessibility practitioners, so every design decision is deliberate and
documented. Targets WCAG 2.2 AAA.

Practical consequence: a change that would be unremarkable on an ordinary site
may be wrong here. Placeholder text, inline styles, an `autocomplete="off"`, a
colour below 7:1 — all are refused on purpose. See §9.

---

## 2. Repositories and local trees

| Repo | Holds | Local path on Bob's Mac |
|---|---|---|
| `github.com/bobdodd/a11ybob-website` | the Next.js site, all pages, the API routes, the map viewers | `~/Documents/Claude/Projects/Market Bob/a11ybob` |
| `github.com/bobdodd/tiled-toronto-map` | tile generation, OSM parsing, DEM/gradient pipeline, GTFS ingest, the background runners | `~/Documents/Bob/Claude/Tiled City Map` |

**The two repos meet only at OpenSearch.** The map repo writes the
`map-features` and `transit-stops` indices on the VPS; the site repo reads them.
Neither imports the other. Work on transit or tiles needs no site deploy, and a
site deploy never touches map data.

Drafts of long-form content are staged outside both repos in
`~/Documents/Claude/Projects/Market Bob/` as `experience-<slug>.draft.md` and
`experience-<slug>-content.md`.

---

## 3. Stack

- **Next.js 16** with Turbopack, React, TypeScript, App Router.
  **This is not the Next.js you may remember.** `AGENTS.md` says it plainly:
  read `node_modules/next/dist/docs/` before writing framework code. `middleware.ts`
  is deprecated in favour of `proxy.ts`; several APIs moved.
- **MongoDB** (self-hosted on the VPS, authenticated) — the content store.
- **OpenSearch** (localhost on the VPS) — all search, plus the map and transit indices.
- **Caddy** — TLS, reverse proxy to the Next app on `127.0.0.1:3000`, and static
  file serving for the non-Next parts.
- **pm2** — keeps the Next app running (`pm2 restart a11ybob`).
- **OVH VPS**, Ubuntu, user `ubuntu`. SSH alias `a11ybob-vps`.

Server layout:

```
/home/ubuntu/a11ybob-website/   the deployed source tree (Next app)
/srv/tiles/                     SVG map tiles, served at tiles.a11ybob.com
/srv/cpacc/                     private CPACC course, Caddy basic_auth
/srv/stats/                     GoAccess visitor stats, stats.a11ybob.com
/home/ubuntu/map-data/          staging for map/transit index uploads
```

`/srv` is the box's convention for static roots. There is no `/var/www`.

---

## 4. Information architecture

Nine top-level nav zones. In the App Router they are grouped by *audience*, not
by URL, using route groups — the group name in parentheses never appears in a URL.

```
src/app/(site)/
  (writing)/      → /writing, /about
  (knowledge)/    → /research, /writing/experience, /writing/glossary, /writing/reviews
  (adaptation)/   → /adaptation
  (tools)/        → /maps, /paradise, /playgrounds, /tools
  (self)/         → /now, /colophon, /contact, /privacy, /accessibility
```

So `src/app/(site)/(knowledge)/writing/experience/[slug]/page.tsx` serves
`/writing/experience/<slug>`.

### The zones

- **Writing** — a *hub*, not a corpus. It fans out to four corpora:
  - **Research essays** (`/writing/research-essays`) — long-form synthesis. Versioned.
  - **Experience** (`/writing/experience`) — first-person, LinkedIn-style pieces, often very long.
  - **Reviews** (`/writing/reviews`) — ~2,600 documents.
  - **Glossary** (`/writing/glossary`) — ~6,700 entries.
  Old URLs 308-redirect to the current shape; do not break them.
- **Research** — CISNA, the Measure of Accessibility series, Spotlight, PTD, the 2029 framework.
- **Adaptation** — the Accessible Tetris case study and the adaptation model. Nine sub-pages.
- **Paradise** — the accessibility analysis platform: analysers, widget patterns, architecture, lineage.
- **Tools**, **Playgrounds**, **Maps**, **Work**, **About**.

### Maps

Five demos, deliberately arranged along one **granularity spectrum** from a
whole-city visual map to a conversational one. Micronavigation (step-by-step
guidance) is out of scope on purpose.

| Demo | What it is |
|---|---|
| `/maps/tiled-toronto-map` | the whole city as SVG tiles, searchable |
| `/maps/east-toronto-streetmap` | earlier, smaller streetmap |
| `/maps/search-and-map-pins` | search + pins |
| `/maps/context-map` | describe-only, screen-reader-first, disclaimer-gated |
| `/maps/conversational-map` | chat over the map index |
| `/maps/knowledge-map` | the v2: conversational + Wikipedia/Wikivoyage knowledge + transit + memory |

Viewer code for each lives in `public/demos/<name>/` as plain JS — **not** in
`src/`. It is served as static files, so a change there needs no rebuild, only a
redeploy. The tiled map's viewer is manually synced from the map repo's
`web-app/`; the two have drifted before.

---

## 5. Content model — what lives where

**The repo is the source; Mongo is the deployed copy** — the same relationship
code has with the server (decision 0012). Long-form writing lives in `content/`
and is published into Mongo; pages are thin and read from Mongo at request time
(`export const dynamic = "force-dynamic"`). Reviews and the glossary are bulk
data with no repo files and remain Mongo-only.

| Collection | Feeds | Notes |
|---|---|---|
| `articles` + `article_versions` | `/writing/research-essays` | versioned; see decision 0003 |
| `experiences` | `/writing/experience` | flat documents, markdown body |
| `reviews` | `/writing/reviews` | |
| `glossary` | `/writing/glossary` | |
| `knowledge` | place-knowledge cache | Wikipedia/Wikivoyage extracts |

**Never run `scripts/seed-mongo.sh`.** It drops and reloads. The database is
authoritative; the seed files are stale.

### Adding an Experience piece or a research essay

One file per piece, in the repo. The filename is the slug.

```
content/experience/<slug>.md
content/article/<slug>.md
```

1. Draft privately as `experience-<slug>.draft.md` in the Market Bob folder;
   Bob edits. **The repo is public, so drafts stay out of it.**
2. When it publishes, move the final markdown to `content/<kind>/<slug>.md` and
   put YAML front matter on top:

   ```yaml
   ---
   title: 'How steep is this path? Adding gradient data accessibly to digital maps'
   publishedAt: '2026-08-06'
   originUrl: 'https://www.linkedin.com/pulse/…'
   originLabel: 'LinkedIn'
   tags:
     - 'accessibility'
     - 'maps'
   ---
   ```

   Articles may also carry `domains`. A body `# heading` is fine — both readers
   detect it and suppress their own `<h1>`.
3. Cover image to `public/images/experience/<slug>/cover.png`, referenced from
   the body as `![alt](/images/experience/<slug>/cover.png)`. The publisher
   refuses if it is missing.
4. `npx tsx scripts/publish-content.ts content/experience/<slug>.md`
   (or `--all`, which is idempotent). Add `--check` to validate and write
   nothing.
5. `npm run index` to reindex OpenSearch.

Content needs **no deploy** — it lives in Mongo and the pages read it at request
time. See [decision 0012](decisions/0012-content-files-in-the-repo.md).

**The publisher validates every file before writing any**, and one error stops
the run. It refuses on: a bad slug, missing `publishedAt`, an unknown
front-matter key, a markdown table (they do not render — see below), an image
that is not in `public/`, empty alt text, and mojibake. It warns on missing
tags, em-dashes, and first-person plural.

`allowMojibake: '<reason>'` exempts one file, and is a string so the reason gets
written down. Exactly one file uses it: a piece that quotes a language-detection
model verbatim, where the mangled characters are the subject.

`scripts/export-content.ts` goes the other way (Mongo to files, published only,
read-only) and is how you check the repo still agrees with the database.

**Markdown gotcha:** the renderer is `react-markdown` with `rehypeRaw` and
**no `remark-gfm`**. Markdown tables therefore do **not** render. Use a raw HTML
`<table>` — it passes through `rehypeRaw` and picks up element-level styling
from `base.css`. Give it a `<caption>`; the site's own analyser flags tables
without one.

---

## 6. Search

`npm run index` (`scripts/index-opensearch.ts`) rebuilds four indices from
Mongo: `reviews`, `glossary`, `articles`, `experiences`. It **drops and
recreates** each — safe, because Mongo is the source, but it means search is
briefly absent while it runs.

Two further indices are written by the *map* repo and must never be rebuilt by
the site's indexer:

- **`map-features`** — ~94 million OSM documents, ~43 GB, one shard. Streets,
  paths, POIs, accessibility tags, and derived gradients. Written by
  `search-region.py` / `upsert-map.ts`, keyed by `osm_id`.
- **`transit-stops`** — ~374,000 GTFS stops with routes, headways and step-free
  flags. Written by `gtfs-ingest.py` / `upsert-transit.ts`, keyed by
  `<feed_id>:<stop_id>`.

`map-features` has **no region field**, so no region can be cleanly deleted from
it. Plan accordingly.

---

## 7. The API routes

`src/app/api/`:

| Route | Purpose |
|---|---|
| `knowledge-chat` | the Knowledge Map's LLM tool loop |
| `context-chat` | the Conversational Map's, deliberately kept separate |
| `context-stt`, `context-stt-token` | Deepgram speech-to-text |
| `map-search`, `map-nearby` | direct queries over `map-features` |
| `place-knowledge` | Wikipedia/Wikivoyage + Wikidata facts |
| `search` | site search suggestions |

`knowledge-chat/route.ts` is the largest and most carefully commented file in
the repo. Its shape:

- A large cached `SYSTEM` prompt, plus **addenda appended per declared client
  capability** — `SHOW_ON_MAP_PROMPT` when `canShowMap`, `DEPTH_PROMPT` when
  `canSenseDepth`. Four cached prefix variants; each caches independently.
- Tools registered conditionally the same way, so a client is never offered a
  tool it cannot use.
- `CoordGuard` refuses any tool call at coordinates the model was not handed
  this turn — invented coordinates produce real distances from the wrong place.
- Timeouts at three levels: per model call, per tool, and a whole-request budget.
- A repair round that catches the model *claiming* the map moved without having
  called `show_on_map`.

**When adding a client capability, follow that pattern**: a boolean in the
request body, gate both the tool and its prompt text. Do not add either
unconditionally — a tool a client cannot use makes the model lead with a dead
end. (This has happened: the web viewer was told to "start depth sensing on your
phone".)

The Android app sends `canSenseDepth: true` plus `depthContext` when its sensor
is running.

---

## 8. Deploying — read this section twice

### The single-connection rule

Bob's home network is behind a Rogers gateway that **silently blocks outbound
port 22 after a handful of SSH connections in quick succession**. HTTPS keeps
working throughout, so it looks exactly like a VPS outage, a fail2ban ban, or an
auth problem. It is none of those. **Recovery requires physically power-cycling
the gateway**, which stops all work.

Open **one** ControlMaster and multiplex everything over it:

```bash
SOCK=/tmp/cm-a11ybob
ssh -M -S "$SOCK" -fN a11ybob-vps                     # once
rsync -a -e "ssh -S $SOCK" ./ a11ybob-vps:/home/ubuntu/a11ybob-website/
ssh -S "$SOCK" a11ybob-vps '<one chained command>'
ssh -S "$SOCK" -O exit a11ybob-vps                    # close
```

If no master is open, fold the **entire** job into a single `ssh` invocation
chained with `&&`. One invocation is always acceptable. Two is not.

**The trap is that the first call succeeds, so the second feels safe.** It is
not. Never "just check one more thing" over a new connection — batch it, or do
without it. On a port-22 timeout while 443 still works: **stop**, and say so.
Retrying extends the lockout.

*From a machine on a different network the gateway is not in the path, so the
hazard is lower — but keep the discipline anyway. It costs nothing, it is the
house style, and you cannot always tell whose network you are on.*

**Answer read-only questions over HTTPS (443) instead.** Public pages, demos,
search, the chat APIs — all answerable without SSH.

### Push first — this is a precondition, not a nicety

The deploy rsyncs the **working tree**, so anything uncommitted is live but
unrecorded. Before starting: clean tree, and `HEAD` == `origin/main`.

```bash
git fetch --quiet origin main
[ -z "$(git status --porcelain)" ] \
  && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] \
  && echo "SAFE TO DEPLOY" || echo "STOP — commit and push first"
```

It matters for two reasons. It keeps `origin` describing the running site, which
is what lets a second machine or a sandbox be trusted at all. And it makes the
`pre-push` hook — which runs `npm run build` and refuses the push on failure —
gate every deploy, which it never did before, because deploys did not involve
git. See [decision 0011](decisions/0011-push-before-deploy.md).

Content changes are exempt: they live in Mongo and need no deploy.

### The deploy itself

Per decision 0009: **rsync from the local working tree**, then build on the box.
Git is not involved; deploying and committing are independent acts.

```bash
rsync -a -e "ssh -S $SOCK" \
  --exclude '.env.local' --exclude '.git' --exclude 'node_modules' \
  --exclude '.next' --exclude '.deploy-tmp' --exclude '/IMAGES' \
  --exclude '*.pdf' --exclude 'CLAUDE.md' --exclude 'AGENTS.md' \
  --exclude '.DS_Store' --exclude 'tsconfig.tsbuildinfo' \
  ./ a11ybob-vps:/home/ubuntu/a11ybob-website/

ssh -S "$SOCK" a11ybob-vps 'cd /home/ubuntu/a11ybob-website \
  && npm run build && pm2 restart a11ybob && echo DEPLOY_OK'
```

- **`.env.local` is the dangerous exclude.** The VPS copy holds the production
  Mongo and OpenSearch URLs and the API keys; the local copy is a localhost
  stub. Syncing it points production at nothing and takes the chat demos down.
- **No `--delete`**, ever. Other regions' tiles and other content share the tree.
- **`pm2 restart` sits behind `&&`**, so a failed build leaves the previous
  process serving.
- **Run `npm run build` locally first.** A pre-push git hook builds on push, but
  deploys come from the working tree, so nothing gates a deploy automatically.
- Verify afterwards **over HTTPS**, not over SSH.

### ⚠ Deploying from a second machine

Because deploy is "rsync whatever is in this working tree", a second machine
with a stale checkout **will overwrite the server with old files**. Before any
deploy from the second machine: `git pull`, confirm the tree is current, and
check whether uncommitted work exists on the *other* machine that has been
deployed but not committed. That situation is normal here — decision 0009 says
so explicitly — so it is a real risk, not a hypothetical.

Content changes (articles, experiences, glossary) live in Mongo and need **no
deploy at all** — only the insert script and a reindex.

---

## 9. Design system — the non-negotiables

Foundation is **Every Layout** primitives (`src/styles/layouts/`) plus a token
layer (`tokens.css`), an axiom layer, and per-component CSS in
`src/styles/components/`. Cascade layers: `base` → `components` → `utilities`.

- **Never use inline `style={}` for styling.** Inline styles override user
  stylesheets and break every assistive-tech adaptation — magnifier reflow,
  high-contrast sheets, reader modes. *Only* legitimate use: setting a CSS
  custom property that configures a class-based primitive, e.g.
  `style={{"--space": "var(--s2)"}}` on `.stack`. The class encodes behaviour;
  the property tunes one instance.
- **Never use `placeholder`** on an input. It fails 1.4.6 at AAA and vanishes
  when typing starts. Use a visible hint at body size wired with
  `aria-describedby`.
- **Never set `autocomplete="off"`** on a text input. Typing is expensive for
  switch, eye-gaze and explore-by-touch users.
- **AAA contrast floor (7:1)** for text, 3:1 for non-text. Bob tests with macOS
  Invert + Increase Contrast, so carry non-text contrast on **grey luminance**,
  not coloured edges.
- **Links never wrap mid-link** — `a { white-space: nowrap }` is global. Reword
  prose rather than undo it, and keep link text short.
- **Words never break across lines** — `hyphens: none` site-wide. Ragged right
  is the deliberate trade.
- **New-tab links use `NewTabLink`**, which puts a *visible* "(opens in a new
  window)" inside the link.
- **JSX inline spacing:** use `{" "}` between inline elements. There is a
  recurring glued-word bug whose trigger is an HTML entity later in the
  following text node. Verify the **rendered HTML**, not the JSX.

---

## 10. Writing for Bob

- **First-person singular.** "I" / "my", never "we" / "our" — "we" implies a
  team or an AI collaborator and jars on a personal site. An impersonal academic
  register is fine when asked for; "we" still is not.
- **Zero em-dashes** in published articles. (The codebase uses them freely in
  comments; that is fine.)
- Articles are optimised for **extraction** by search engines and AI scrapers:
  headings that state their claim, entities spelled out. But **never** a bio
  line, credentials, or marketing scaffolding.
- Keep Bob's work distinct from CNIB's. autoA11y is his academic work, gifted to
  CNIB; CNIB's tool is now **AccessLens**. Never blur the two.
- **Do not attribute work to AI anywhere public.** No `Co-Authored-By` trailers.
  The one scoped exception is the Accessible Tetris research project, where
  working with AI is part of what is being demonstrated.
- **Every statement of fact needs a source.** A claim either carries a real
  source with a URL, or it is recast as first-person observation ("the
  arrangement I see most often…", "I think…") or as argument. No wild
  generalizations. If a figure or a practice cannot be traced to a page that
  states it, it comes out. Attributing your own principle to an outside body is
  the same fault as inventing a number: two of four "practices to adopt" once
  credited to the GOV.UK Design System were not on the page cited, and one of
  them was this project's own idea, which also made the note contradict itself.
- **The site is the public face. Never defer content to the repository.** No page
  may make a reader visit a GitHub repo to find substance. "The full list is in
  the repository" is not an acceptable design for a page: nobody goes there.
  Where a repo document is the source of truth for maintenance, the page still
  states its content in full and links the repo as provenance, not as the
  destination. This applies with most force to registers, lists, and tables of
  anything — an open-questions register, a decision log, a catalogue. Nor should
  a reader have to hop between pages on this site to assemble one list; a page
  that owns a subject states it completely and cross-links for depth rather than
  for the missing parts. Bob has had to say this twice.
- **Verify citation metadata separately from the content.** Reading a source
  confirms what it says, not how to cite it. Check title, year, volume and pages
  against the DOI record (`https://api.crossref.org/works/<DOI>`, with a
  User-Agent header; note that `created` is the deposit date, not publication),
  never the front matter of a hosted copy — an author-accepted PDF reproduces
  the text faithfully while carrying the acceptance year, which is how a 2023
  paper came to be cited as 2022 with the wrong title. Take the author from the
  byline as printed, and cite it as printed when the name structure is unclear
  rather than inverting it to surname-first. **Never write a byline you have not
  read on the page.** An invented author name is the worst of these faults,
  because unlike the others there was no source to misread.

---

## 11. Working style Bob expects

- **Get explicit buy-in for design and content decisions.** Surface the options,
  name the trade-off, recommend one, then wait. Do not ship undiscussed
  defaults. Once a spec is agreed, execute it without re-confirming.
- **Ask in prose, not the question modal** — the modal hides the message above
  it in his editor.
- **Fix what is reported.** Change only what addresses the problem, and never
  assert a technical claim you have not verified.
- **"Commit" means commit locally.** Push only on an explicit "push".
- **Never drop a production collection or index to test something.** Write a
  local unit test instead.
- Present full detail. When Bob hands over detailed reasoning, it is to be used,
  not summarised. For teaching content, go deeper rather than shorter.
- **Apply the design-tool annotation preset.** Whenever a component is specified,
  documented, or prepared for design-to-engineering handoff, carry the eleven
  annotation fields defined under "Design-tool annotation requirements" in
  `accessible-by-design/docs/APG-SUPPORT.md`: pattern identity, semantic model,
  accessible-name source, relationship model, focus order and initial focus,
  internal keyboard navigation, close and restore-focus behaviour, hidden versus
  removed from the DOM, required visible states, responsive and Reflow
  behaviour, and the assistive-technology uncertainty marker. The relationship
  model is the field most often lost, because it is invisible in a mock-up and
  expensive to reverse-engineer. Obey the annotation economy rule with it: do
  not annotate what the coded component already guarantees — annotate the
  selected component and the product-level choices or deviations only.

---

## 12. Environment variables

Names only — values live in `.env.local` on each machine and on the VPS, and are
never committed.

| Variable | Where | Purpose |
|---|---|---|
| `MONGODB_URI` | both | localhost stub locally; authenticated URI on the VPS |
| `MONGODB_DB` | both | `a11y_paradise` |
| `OPENSEARCH_URL` | both | `http://localhost:9200` |
| `ANTHROPIC_API_KEY` | VPS | the chat demos |
| `DEEPGRAM_API_KEY` | VPS | speech-to-text |
| `CHAT_MODEL` | optional | defaults to `claude-haiku-4-5` |
| `TRACE_TOOLS` | VPS, optional | a secret enabling tool tracing for requests sending it as `x-trace-token` |

`.env.example` carries the three safe ones. **A second machine can run the site
locally with only those** — pointing at a local Mongo and OpenSearch. The API
keys are needed only to exercise the chat demos locally, and the deployed site
has its own copy.

---

## 13. Known traps

- **A 200 is not success** when fetching third-party data — agencies serve HTML
  error pages from `.zip` URLs. Check the payload.
- **Silent partial success** is the worst failure mode here. A paginated
  catalogue read without following the continuation link produces missing data
  with no error.
- The build has failed **silently** on `main` before; a pre-push hook now runs
  `npm run build`.
- OpenSearch SDK v3 has typing regressions — `hits.hits` needs a cast through
  `unknown`.
- The tiled map's `data-name` grouping drives whole-road highlighting. Positive
  `tabindex` on the selected rotor category is **by design**; do not "fix" it.
- Disk on the Mac runs close to full; the map trees and OSM extracts are large.

---

## 14. Where to look first

| Question | File |
|---|---|
| Why is it built this way? | `docs/decisions/000*.md` |
| What are the working rules? | `CLAUDE.md` |
| How does content reach a page? | `src/lib/experiences.ts` (simplest example) |
| How does the map chat work? | `src/app/api/knowledge-chat/route.ts` |
| What does the design system provide? | `/styleguide` on the live site |
| What is deployed right now? | the working tree, not git |
