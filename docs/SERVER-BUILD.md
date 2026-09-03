# Building an OVH VPS the way a11ybob.com is built

A runbook, in order, from a freshly-ordered VPS to a hardened box serving a
Node application over HTTPS.

This is the companion to [decision 0008](decisions/0008-trial-deployment.md),
which records *what was chosen and why*. That entry opens by saying "read this
as history, not as instructions". This file is the instructions. Where the two
disagree, this one describes what is actually running as of 2026-09-03, because
it was written by reading the live server rather than from memory.

**Two parts.** Part 1 is a hardened Ubuntu box with Caddy in front — useful
whatever you intend to serve. Part 2 is the a11ybob application stack (Node,
MongoDB, OpenSearch, pm2) and is only worth following if you are building
something of that shape.

**Substitutions.** Anything in `ANGLE BRACKETS` is site-specific and must be
replaced. No credentials appear anywhere in this file.

---

## What the reference box is

```
OVHcloud VPS, Gravelines
Ubuntu 24.04 LTS, x86_64
6 vCore, 11 GB RAM, 96 GB disk
IPv4 + IPv6 (both assigned by OVH; only IPv4 is used)
```

Sizing note: the 8 GB tier was the original order and was comfortable. The
memory headroom matters more than the cores for this stack — OpenSearch will
take a heap, and MongoDB will use whatever page cache is left.

---

# Part 1 — a hardened box

## 1. First login, and the trap that catches everybody

**OVH ships the VPS with an expired one-time password.** The first SSH login
forces a TTY-bound `passwd` exchange, and **`ssh-copy-id` cannot satisfy it**
because it does not allocate a TTY. If you try to push a key first, it fails in
a way that looks like the key is wrong.

The working order is:

```bash
ssh ubuntu@<VPS-IP>          # interactive; you WILL be asked to change the password
# ... complete the passwd exchange ...
mkdir -p ~/.ssh && chmod 700 ~/.ssh
cat >> ~/.ssh/authorized_keys   # paste your PUBLIC key, then Ctrl-D
chmod 600 ~/.ssh/authorized_keys
exit
```

Then verify key-only login works **before** you disable passwords:

```bash
ssh -o BatchMode=yes ubuntu@<VPS-IP> 'hostname'
```

`BatchMode=yes` refuses to fall back to a password prompt, so a success here
proves the key alone is sufficient. Do not skip this — step 3 removes your
other way in.

Generate the key on your own machine, named for its purpose:

```bash
ssh-keygen -t ed25519 -C "<purpose>-vps" -f ~/.ssh/<name>_ed25519
```

## 2. Patch, then set up SSH config locally

```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
```

On your machine, `~/.ssh/config`:

```
Host <alias>
    HostName <VPS-IP>
    User ubuntu
    IdentityFile ~/.ssh/<name>_ed25519
    IdentitiesOnly yes
    ControlMaster auto
    ControlPath  ~/.ssh/cm-%r@%h:%p
    ControlPersist 10m
```

`IdentitiesOnly yes` matters: without it ssh offers every key in your agent
first, and enough refusals in a row will get you banned by the fail2ban you are
about to install. The `ControlMaster` lines multiplex every later command over
one connection.

## 3. SSH hardening — and why the filename is load-bearing

This is the step that matters most. On this box, before hardening, the journal
showed **~11,888 failed or invalid SSH attempts in 24 hours**. The web traffic
was benign; SSH was where the actual attacks were.

Create `/etc/ssh/sshd_config.d/00-hardening.conf`:

```
PasswordAuthentication no
PermitRootLogin no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
```

**The `00-` prefix is not cosmetic.** Ubuntu ships
`/etc/ssh/sshd_config.d/50-cloud-init.conf`, which sets
`PasswordAuthentication yes`, and **sshd takes the FIRST match it sees**, not
the last. A drop-in must sort *before* `50-` to win. Editing the main
`sshd_config`, or `60-cloudimg-settings.conf`, will silently not take effect.
cloud-init may rewrite the `50-` file on rebuild, but it can never sort before
`00-`.

Validate before reloading, or a syntax error locks you out:

```bash
sudo sshd -t                       # exits non-zero and prints the error
sudo systemctl reload ssh
sudo sshd -T | grep -E 'passwordauthentication|permitrootlogin'
```

Expect `passwordauthentication no` and `permitrootlogin no`.

> On Ubuntu 24.04 `systemctl is-enabled ssh` reports **disabled** while ssh is
> plainly working. That is correct: 24.04 uses socket activation, so
> `ssh.socket` is the enabled unit. Do not "fix" it.

## 4. fail2ban

```bash
sudo apt install -y fail2ban
```

`/etc/fail2ban/jail.local`:

```ini
[sshd]
enabled  = true
backend  = systemd
maxretry = 4
findtime = 10m
bantime  = 1h
```

**`backend = systemd` is required on Ubuntu 24.04.** There is no
`/var/log/auth.log` — logs live in the journal — so the default file backend
silently watches a file that never appears, and bans nothing.

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

On the reference box that currently reports 501 total failures, **70 total
bans**, 3 currently banned. If yours reports zero bans after a day, the backend
is wrong.

## 5. Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp  comment ssh
sudo ufw allow 80/tcp  comment http
sudo ufw allow 443/tcp comment https
sudo ufw enable
sudo ufw status verbose
```

ufw covers IPv4 and IPv6 from one rule each. Backend services are *also* bound
to `127.0.0.1` in Part 2 — two locks on the door, not one, so a ufw mistake
does not expose a database.

## 6. Caddy — TLS with no certificate management

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

**Before DNS points at the box**, keep the Caddyfile IP-only:

```
:80 {
    encode zstd gzip
    reverse_proxy 127.0.0.1:3000
}
```

Naming a hostname before its A record resolves makes Caddy attempt an ACME
challenge that must fail, and repeated failures risk a Let's Encrypt rate
limit. Point DNS first, confirm it resolves, then swap `:80` for the hostname
— Caddy provisions and renews the certificate with no further action.

A minimal production block, with the security headers this box uses:

```
<example.com>, www.<example.com> {
    encode zstd gzip
    reverse_proxy 127.0.0.1:3000

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options    "nosniff"
        X-Frame-Options           "SAMEORIGIN"
        Referrer-Policy           "strict-origin-when-cross-origin"
        Permissions-Policy        "camera=(), microphone=()"
    }
}
```

Set `microphone=(self)` only if the site genuinely uses speech input; this box
does, for its map demos. A strict `Content-Security-Policy` is deliberately
**not** here — it can break a Next.js app and needs testing rather than
copying.

```bash
sudo caddy validate --config /etc/caddy/Caddyfile   # ALWAYS before reload
sudo systemctl reload caddy
```

### Things this box's Caddyfile does that are worth stealing

- **Static content served straight off disk**, beside the proxied app:
  `handle_path /<path>/* { root * /srv/<dir>  file_server }`. Updating it is
  one rsync — no rebuild, no app restart, and a broken app build cannot take
  it down.
- **Password-protecting a path** with `basic_auth { <user> <bcrypt-hash> }`.
  Generate the hash with `caddy hash-password`. Note HTTP Basic *requires* a
  username; there is no password-only option.
- **Log filtering.** `log_skip` on a matcher keeps bots and framework prefetch
  requests out of the access log — they are still served, just not recorded.
- **IP masking at write time.** The log block zeroes the last IPv4 octet and
  the last 32 IPv6 bits *before* anything reaches disk, so a full address is
  never stored. With `roll_keep_for 168h` the raw logs are short-lived and
  only non-identifying aggregates persist.
- **Serving precompressed files** with `file_server { precompressed br }`, and
  *not* enabling `encode` on that host, so pre-built `.br` sidecars are served
  as-is.

## 7. Backups

Not in any decision record, but running here nightly:

```
30 3 * * * /home/ubuntu/backups/backup-mongo.sh >> /home/ubuntu/backups/backup.log 2>&1
```

Write the equivalent before you need it. A `mongodump` to a dated directory,
pruned after N days, is enough — the point is that it exists and is on a timer.

---

# Part 2 — the application stack

Only if you are building the same shape.

## 8. Node

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v      # v20.x
```

Server-wide, single app. `nvm` was rejected: it adds shell-activation ceremony
for no benefit on a single-tenant box, and it interacts badly with systemd
units that do not source a login shell.

## 9. MongoDB

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc \
  | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/7.0 multiverse" \
  | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
```

Match the major version to whatever you run locally, so dumps round-trip.

`/etc/mongod.conf` — the two lines that matter:

```yaml
net:
  bindIp: 127.0.0.1
security:
  authorization: enabled
```

Create the application user **before** enabling authorization, or you will lock
yourself out of an empty database. Give it `readWrite` on the application
database only, not `root`, and set `authSource` to the application database
rather than `admin` in the connection string — that scopes the credential's
authority to one database.

## 10. OpenSearch

```bash
curl -o- https://artifacts.opensearch.org/publickeys/opensearch.pgp \
  | sudo gpg --dearmor -o /usr/share/keyrings/opensearch-keyring
```

**Use `opensearch.pgp`, not `opensearch-release.pgp`.** OpenSearch publishes
both and their own documentation points at the wrong one for the 2.x repo. The
symptom is an apt signature failure that looks like a mirror problem.

```bash
echo "deb [signed-by=/usr/share/keyrings/opensearch-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/apt stable main" \
  | sudo tee /etc/apt/sources.list.d/opensearch-2.x.list
sudo apt update && sudo apt install -y opensearch
```

For a **localhost-only, single-application** deployment, run single-node with
the security plugin disabled and the listener on loopback:

```yaml
network.host: 127.0.0.1
discovery.type: single-node
plugins.security.disabled: true
```

The security plugin is right for a multi-tenant or externally-exposed cluster.
Here it is pure overhead in front of a service already unreachable from outside
the box.

> **Discrepancy to check on the reference box.** 0008 records these overrides
> as appended to `/etc/opensearch/opensearch.yml`. Reading that file today, it
> contains **no active settings at all** — every line is a comment. OpenSearch
> is running and reachable on `localhost:9200`, so either the settings were
> removed and the defaults happen to suffice, or they live somewhere I did not
> look. Worth resolving before treating this section as verified.

## 11. pm2

```bash
sudo npm install -g pm2
cd /home/ubuntu/<app>
pm2 start npm --name <app> -- start
pm2 startup            # prints a sudo command — run it
pm2 save               # snapshot the process list so it survives reboot
```

`pm2 startup` generates a systemd unit (`pm2-ubuntu`); `pm2 save` is what makes
the running set come back after a reboot. Doing one without the other gives you
a service that starts and runs nothing.

## 12. Confirm everything survives a reboot

```bash
for u in mongod opensearch caddy fail2ban pm2-ubuntu; do
  printf '%-12s %s\n' "$u" "$(systemctl is-enabled $u)"
done
sudo reboot
```

Then check the site answers. A stack that works until the first unplanned
reboot is not deployed.

---

## Deploying, afterwards

Recorded separately in [0009](decisions/0009-production-deployment.md) and
[0011](decisions/0011-push-before-deploy.md): rsync from the working tree,
build on the server behind `&&` so a failed build leaves the previous process
serving, `pm2 restart` last, and **push before you deploy**.

One inherited constraint that is specific to *this* operator and may not apply
to your colleague: Bob's home network sits behind a gateway that silently
blocks outbound port 22 after a burst of connections, so every remote step is
multiplexed over a single SSH ControlMaster. If your colleague's network has no
such behaviour the discipline is still good practice, but it is not the
emergency it is here.

---

## Log locations

```
MongoDB     /var/log/mongodb/mongod.log
OpenSearch  /var/log/opensearch/opensearch.log
Caddy       journalctl -u caddy    (access log: /var/log/caddy/)
pm2         pm2 logs <app>
SSH         journalctl -u ssh      (no /var/log/auth.log on 24.04)
fail2ban    sudo fail2ban-client status sshd
```

## The five things most likely to waste a day

1. **OVH's expired first-login password** — `ssh-copy-id` cannot get past it.
2. **`00-` versus `50-` in `sshd_config.d`** — sshd is first-match, so a
   hardening file that sorts after cloud-init's does nothing.
3. **fail2ban's `backend`** — the file backend watches a log that does not
   exist on 24.04 and bans nobody, silently.
4. **OpenSearch's two signing keys** — the documented one is the wrong one.
5. **Naming a hostname in the Caddyfile before DNS resolves** — failed ACME
   challenges risk a Let's Encrypt rate limit, which is a waiting game.

Two of those five fail *silently*, which is what makes them expensive.
