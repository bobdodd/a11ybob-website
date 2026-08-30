# 0011 — Push before deploy

**Date:** 2026-08-30
**Status:** Accepted
**Amends:** [0009](0009-production-deployment.md), on one point only — the
relationship between git and a deploy. The rsync mechanism itself is unchanged.

## What this is

[0009](0009-production-deployment.md) recorded that the deploy is an rsync of
the local working tree, and drew the consequence plainly: "**deploying and
committing are independent acts**. Neither implies the other." That was accurate
and it was deliberate — it keeps a rendering tweak from becoming a commit.

It also, over about four months, let the repo stop describing the site. An audit
on 2026-08-30 compared the deployed tree against `main` and found:

- `public/demos/tiled-toronto-map/src/app.js` and `styles/main.css` — the
  road-highlight and Safari label-halo fixes, live since 6 August, uncommitted.
- `src/app/api/knowledge-chat/route.ts` — the depth-sensor work, live since
  18 August, uncommitted.
- `public/images/experience/how-steep-is-this-path/cover.png` — deployed
  straight to the server and never added. **Every other Experience piece has its
  cover image in the repo.** Rebuilding from `main` would have published that
  article with a broken image.
- `src/lib/route.ts` — a stale 542-line copy of the knowledge-chat route, in a
  directory where it is not a route at all. It arrived by an errant copy and
  survived because the deploy never uses `--delete`. It sat there for weeks, in
  the TypeScript compile path, a second copy of a file under active edit.

None of that was visible from either side alone. The repo could not be rebuilt
into the running site, which is the property a repo exists to have.

## Choice

**A deploy must be preceded by a push.** Before the rsync: the working tree is
clean, and `HEAD` equals `origin/main`.

Checkable without touching the network, so it can precede the deploy commands
rather than being remembered:

```bash
git fetch --quiet origin main
[ -z "$(git status --porcelain)" ] \
  && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] \
  && echo "SAFE TO DEPLOY" || echo "STOP — commit and push first"
```

### Why push, and not merely commit

Committing locally would make `main` describe the site on *this* machine. It
would not make the site reproducible from anywhere else, and from 2026-08-30
there is a second machine and a read-only sandbox that both need `origin` to be
the truth. A local commit is invisible to them.

### The consequence that decides it

**This turns the `pre-push` hook into a real deploy gate.** 0009 recorded the
gap and could not close it:

> a `pre-push` git hook runs `npm run build` and refuses the push on failure.
> That catches the silent-broken-build class of error 0008 was burned by, but
> only on push. It does not gate a local commit, and because deploys come from
> the working tree, **it does not gate a deploy at all.**

If every deploy is preceded by a push, every deploy is preceded by a green
`npm run build` — enforced by the hook, not by discipline. The site has failed
to build silently on `main` before. That is the CI this project has never had,
obtained for free from a rule it needed anyway.

## What does not change

- **The mechanism.** Still `rsync -a` from the working tree, still building on
  the box behind `&&`, still no `--delete`, still the same excludes. This entry
  changes when a deploy may start, not how it runs.
- **Still no deploy script.** 0009 rejected one because a script that opens its
  own connections is how the single-connection discipline gets violated. The
  check above is local and touches nothing but git.
- **"Commit" still means commit.** Bob asks for a push explicitly; nothing here
  makes committing imply pushing. It makes *deploying* imply having pushed.
- **Content is unaffected.** Articles, experiences, reviews and the glossary
  live in Mongo. Publishing them needs an insert script and a reindex, not a
  deploy, so this rule does not apply to them.

## Rejected

- **Enforcing it in a hook.** There is no deploy command to hang a hook on, by
  design. The check is a precondition you run, in the same spirit as writing the
  deploy sequence out each time rather than scripting it.
- **`--delete` on the rsync.** It would have removed `src/lib/route.ts`
  automatically, which is tempting. Still rejected for the reason 0009 gives:
  the blast radius if an exclude is ever wrong is the whole application, and
  other regions' tiles share the tree. Stale files are found by audit instead —
  the query that matters is *files on the server that exist in no repo at all*.
- **Deploying from git on the box** (`git pull` on the server). Rejected in 0009
  because it forces a commit to deploy and because the working tree is the thing
  being tested. Both still hold; this entry gets the reproducibility benefit
  without giving up working-tree deploys.

## Accessibility implications

Indirect but real. The pre-push build is what stops a broken build reaching a
site whose audience includes people for whom re-navigating a failed page is
expensive. Until now it only ran on push, and pushes were optional. Now it runs
before every deploy.

The audit's clearest finding is also an accessibility one: the cover image
missing from the repo would have rebuilt as a broken image with its alt text
intact but nothing behind it — a page that reads as complete to a screen reader
and is visibly broken to everyone else.

## Amends

Amends [0009](0009-production-deployment.md) on the git/deploy relationship
only. Everything else in 0009 — the mechanism, the excludes, the
single-connection rule, the rejection of a deploy script and of CI — stands.
