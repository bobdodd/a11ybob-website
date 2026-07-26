# 0009 — Production deployment: rsync from source

**Date:** 2026-07-25
**Status:** Accepted
**Supersedes:** [0008](0008-trial-deployment.md), on the deploy mechanism only.

## What this is

[0008](0008-trial-deployment.md) recorded the trial deployment and chose a
deploy mechanism of "SSH in, `git pull`, `npm ci`, `npm run build`,
`pm2 restart a11ybob`", documented rather than scripted because a script
"would lock in the shape before we know if it's the right shape".

The shape changed. Deployment is now an **rsync of the local source tree**,
and git is not involved. That drift went unrecorded for some time, and 0008
was actively misleading anyone who read it: it still describes a git-pull
flow, and still calls the site trial-only at `http://66.70.189.24/` when it
has been live at `https://a11ybob.com` since the DNS cutover.

This entry records the mechanism as it actually is. It re-decides nothing
about hosting, the database, or the runtime stack; those parts of 0008 stand
until something supersedes them in turn.

## Choices

- **Deploy source is the working tree, not a git ref.** `rsync -a` from the
  local repo root to `/home/ubuntu/a11ybob-website/`, then build on the box.
  A deploy therefore reflects local edits whether or not they are committed,
  and **deploying and committing are independent acts**. Neither implies the
  other, which is worth stating plainly because the git-pull flow in 0008
  coupled them and readers reasonably assume that coupling still holds.
- **One SSH connection, always.** Every remote step multiplexes over a single
  ControlMaster socket: open the master, rsync with `-e "ssh -S <socket>"`,
  run one chained remote command, close it. This is not a preference. Bursting
  SSH from Bob's home network trips the gateway's outbound port-22 block,
  which looks exactly like a VPS outage while HTTPS keeps working, and
  recovery needs a physical power-cycle. `~/.ssh/config` sets
  `ControlMaster auto` / `ControlPersist 4h` for the `a11ybob-vps` host so
  reuse is automatic and cannot be forgotten.
- **Build on the server, not locally.** The remote command chains
  `npm run build && pm2 restart a11ybob` with `&&`, so pm2 only restarts on a
  green build. A failed build leaves the previous process serving.
- **Excludes are part of the mechanism, not housekeeping.** The rsync excludes
  `.env.local`, `.git`, `node_modules`, `.next`, `.deploy-tmp`, `/IMAGES`,
  `*.pdf`, `CLAUDE.md`, `AGENTS.md`, `.DS_Store` and `tsconfig.tsbuildinfo`.
  **`.env.local` is the dangerous one.** The VPS copy holds the production
  Mongo and OpenSearch URLs plus `ANTHROPIC_API_KEY`, `DEEPGRAM_API_KEY` and
  `TRACE_TOOLS`; the local copy is a ~100-byte localhost stub. Syncing it
  would silently point production at nothing and take the Conversational Map
  down with it.
- **No `--delete`.** Nothing accumulates on the server that needs it, and the
  blast radius if an exclude is ever wrong is the whole application. Files
  that genuinely need removing are removed explicitly, in the same chained
  remote command as the build.
- **Permissions travel.** `rsync -a` preserves mode bits, so a source file
  that is `700` locally arrives `700`. Normalise new assets to `644` before
  deploying. This has bitten once already, with a figure that would have
  deployed unreadable.
- **Verify over HTTPS, not over SSH.** Port 443 is never blocked, so
  post-deploy checks (status codes, rendered markup, sitemap) go over the
  public URL after the master connection is closed. Reserve SSH for what
  needs a shell.

## Rejected

- **A deploy script.** Still rejected, and for a better reason than in 0008:
  the single-connection discipline is easy to violate by accident, and a
  script that opens its own connections is precisely how that happens. The
  sequence is short and is written out each time deliberately. (The
  background reindex runners *do* script it, and they are careful to share
  one ControlMaster socket for exactly this reason.)
- **Git-based deploy (pull, or a post-receive hook).** Rejected because it
  forces a commit to deploy, which turns every trial of a rendering tweak
  into a commit, and because the working tree is the thing being tested.
  The server directory is still a git checkout, but its git state is not
  meaningful and should not be trusted as a record of what is deployed.
- **CI/CD.** Still no CI. 0008 flagged this as "a real gap … before the
  production deploy", and the gap is now partly closed from a different
  direction: a **`pre-push` git hook runs `npm run build`** and refuses the
  push on failure. That catches the silent-broken-build class of error 0008
  was burned by, but only on push. It does not gate a local commit, and
  because deploys come from the working tree rather than from git, **it does
  not gate a deploy at all.** Running the build locally before deploying
  remains a manual discipline.

## Accessibility implications

- The excluded `.env.local` carries the API keys for the Conversational Map
  and the Context Map's speech services. Getting the exclude wrong does not
  degrade the site cosmetically; it removes the conversational and spoken
  interfaces, which are the accessible affordance for the users those demos
  exist for.
- Building on the server behind `&&` means a broken build cannot replace a
  working site with an error page. For a site whose audience includes people
  for whom re-navigating a broken page is expensive, failing closed is the
  right default.
- Deploying from the working tree makes it easy to ship an accessibility fix
  quickly, and equally easy to ship an unreviewed local experiment. The
  discipline that keeps that honest is running the build and checking the
  rendered markup, not the deploy mechanism itself.

## Supersedes / superseded by

Supersedes 0008 on the deploy mechanism. The hosting, firewall, Node,
MongoDB, OpenSearch, Caddy and pm2 choices in 0008 are untouched here, as is
its record of what broke during the trial. The production database question
this entry declined to answer is now recorded in
[0010](0010-production-database.md): self-hosted MongoDB with authentication,
the managed tier having never been adopted.
