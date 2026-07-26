# 0008 — Trial deployment

**Date:** 2026-05-15
**Status:** Accepted; **partly superseded** by
[0009](0009-production-deployment.md) (deploy mechanism only)

> **Read this as history, not as instructions.** The deploy mechanism below
> (`git pull`, `npm ci`, `npm run build`, `pm2 restart`) is no longer how the
> site is deployed: see [0009](0009-production-deployment.md), which records
> the rsync-from-source flow. The trial URL below is also historical, as the
> site has been live at `https://a11ybob.com` since the DNS cutover. Everything
> else here (hosting, firewall, Node, MongoDB, OpenSearch, Caddy, pm2, and the
> account of what broke) still stands.

## What this is

The first end-to-end deployment of a11ybob.com to the OVH VPS-1 at
Gravelines. Trial-only: no DNS, no TLS, no announcement. Reachable at
`http://66.70.189.24/` for verification, not for visitors. Production
shape (managed MongoDB, DNS + automatic TLS via Caddy, content cutover)
will be a later decision once the trial has surfaced any operational
issues.

## Choices

- **Hosting:** OVHcloud VPS-1, Ubuntu 24.04.3 LTS, Gravelines DC. Both
  IPv4 and IPv6 configured by OVH; only IPv4 used for the trial.
- **SSH:** ed25519 deploy key, named for purpose
  (`a11ybob_vps_ed25519`). Default `ubuntu` user with passwordless
  sudo (cloud-image default). Root login over SSH not used; password
  auth still permitted at the OS level (default Ubuntu) but no
  passwords known to anyone but Bob, key is required for automation.
- **Firewall:** `ufw` — deny in, allow out, with explicit allow rules
  for 22/tcp, 80/tcp, 443/tcp (v4 and v6 each). Backend services
  (Mongo 27017, OpenSearch 9200) are bound to `127.0.0.1` so ufw
  doesn't need to do that work too — two locks, not one.
- **Node:** 20 LTS via the NodeSource apt repo. Server-wide, single
  app. nvm was rejected as adding activation ceremony for no gain on a
  single-tenant box.
- **MongoDB:** 7.0 from the official mongodb-org apt repo. Matches the
  Homebrew version used locally, so dumps round-trip cleanly. Bound to
  `127.0.0.1`.
- **OpenSearch:** 2.19.5 from the official OpenSearch 2.x apt repo
  (bundles Lucene 9.12.3). Single-node mode, security plugin disabled
  (`plugins.security.disabled: true`), `network.host: 127.0.0.1`. The
  security plugin is the right thing for a multi-tenant or
  externally-exposed cluster; for a localhost-only single-app
  deployment its overhead is pure cost.
- **Reverse proxy:** Caddy 2.11.3 from the cloudsmith stable repo. The
  Caddyfile is one block:
  ```
  :80 {
      encode zstd gzip
      reverse_proxy 127.0.0.1:3000
  }
  ```
  When DNS arrives, swap `:80` for the hostname; Caddy will then
  provision Let's Encrypt automatically. No conscious certificate
  management.
- **Process manager:** pm2 7.0.1 (global npm install). Daemonised as
  `a11ybob`, set to autostart via the systemd unit `pm2-ubuntu` that
  `pm2 startup` generates. `pm2 save` snapshots the running process
  list so it survives reboots.
- **Auto-start on reboot:** All four services (`mongod`,
  `opensearch`, `caddy`, `pm2-ubuntu`) enabled in systemd. Verified by
  `systemctl is-enabled` after the bootstrap.
- **Deploy mechanism:** SSH in, `git pull`, `npm ci`, `npm run build`,
  `pm2 restart a11ybob`. No CI, no preview environments. Documented
  rather than scripted for the trial — a script would lock in the
  shape before we know if it's the right shape.
- **Data:** seeded via `mongodump` from the local Homebrew Mongo
  rsynced to the VPS and restored with `mongorestore --drop`.
  Collections verified to match the local counts exactly
  (`reviews` 2661, `glossary` 6660, `articles` 17,
  `article_versions` 20). OpenSearch indexes built afterwards with
  `npm run index`.

## Rejected (for the trial; reconsider for production)

- **OVH managed MongoDB free tier (Gravelines).** This is the
  production target per the plan's §6, but it adds a TLS connection
  string, IP whitelist, and an external dependency before we know the
  app shape on the VPS is right. Self-hosted Mongo on the VPS for the
  trial; managed Mongo for production.
- **DNS + TLS.** Deliberately deferred. The trial proves the build
  pipeline and the runtime stack; the public-name decision is its own
  step (apex `a11ybob.com` vs `staging.*`, when to point DNS, how to
  handle the cutover from the old SiteGround site).
- **Docker / docker-compose.** Disallowed on Bob's machine generally
  ([[feedback_no_docker]]); also unwanted on the server. Native
  systemd services are simpler and inspectable.

## What broke and how it was resolved

Three things broke during the trial deploy that are worth a footnote
both here and in `/colophon`:

1. **The local build had been silently failing on `main`.** Two real
   bugs (`hits.total?.value` undefined access; type-narrowness in the
   `/api/search/suggest` route) plus a clutch of OpenSearch SDK v3
   strictness mismatches blocked `npm run build`. Fixed and committed
   before the deploy proceeded (`Restore green build` commit).
   *Implication:* nothing currently runs `npm run build` automatically
   and `npm run lint` doesn't catch this class of issue. CI is a real
   gap and should be wired in before the production deploy.

2. **OpenSearch's apt signing key.** OpenSearch publishes two .pgp
   files. `opensearch-release.pgp` is the newer key not yet signing
   the 2.x bundle repo; `opensearch.pgp` is the older 2.x signing
   key. Their own documentation points at the wrong one as of this
   writing. Used `opensearch.pgp`.

3. **OVH first-login password change.** OVH ships the VPS with an
   expired one-time password requiring a TTY-bound `passwd` exchange
   on first SSH; `ssh-copy-id` cannot satisfy that prompt because it
   doesn't allocate a TTY. The flow was: interactive SSH → change
   password → append deploy key to `authorized_keys` in the same
   session → exit. Documented because the OVH docs don't mention it.

## Accessibility implications

- **Response time.** Self-hosted single-node OpenSearch on a 4 vCore /
  8GB box does the lit-review search in well under the perceptual
  limits that matter for screen-reader users (who can't visually
  pre-scan a loading state). Specific latencies should be measured
  with the production data shape before launch.
- **No JavaScript fallbacks.** The trial deploys the full app
  including JS-driven search. The plan is explicitly *not* to fall
  back to a no-JS path; the accessibility approach is "rich JS done
  accessibly" (see [0001](0001-stack.md)). Confirming this is the
  right call by deploying it and exercising it with assistive tech is
  itself part of why the trial exists.
- **Caddy's automatic encoding** (`encode zstd gzip`) is on; payload
  size affects time-to-content for users on slow connections, which
  is a population that overlaps with the population using
  legacy-or-restricted assistive tech.

## Operational notes (not decisions; reference)

- Service log paths: Mongo `/var/log/mongodb/mongod.log`, OpenSearch
  `/var/log/opensearch/opensearch.log`, Caddy via `journalctl -u
  caddy`, pm2 via `pm2 logs a11ybob`.
- OpenSearch trial-deploy overrides are appended to the bottom of
  `/etc/opensearch/opensearch.yml` with a dated comment marker.
- The dump used to seed the VPS lives at `.deploy-tmp/` locally and is
  gitignored. Don't commit it.

## Supersedes / superseded by

Partly superseded by [0009 — Production deployment: rsync from
source](0009-production-deployment.md), which records the deploy mechanism as
it actually is. The rest of this entry stands.

Anticipated a single "production-deploy decision" covering DNS, TLS, managed
Mongo and the SiteGround cutover. That is not how it happened: DNS and TLS
went live piecemeal (apex and www on the VPS, Caddy provisioning Let's Encrypt
automatically, as this entry predicted), and the deploy mechanism changed
separately, which is what 0009 records. The **managed-Mongo question** raised
here is answered by [0010](0010-production-database.md): the move never
happened, and production still runs the self-hosted MongoDB installed for this
trial, now with authentication. The "production target" named below was an
intention, not an outcome.
