#!/usr/bin/env bash
#
# ⚠  DANGER — ONE-TIME MIGRATION IMPORT, NOT A ROUTINE SEED.  ⚠
#
# This script DROPS and reloads the `glossary` and `reviews`
# collections from a Flask-CMS backup JSON. It exists only to record
# how the database was first populated when a11ybob.com was migrated
# off the old Flask site.
#
# The MongoDB database is now the SOURCE OF TRUTH. Reviews and glossary
# entries are added DIRECTLY to it (then reindexed into OpenSearch with
# `npm run index`); there is no upstream to re-seed from. Running this
# script today will DESTROY everything added since the migration and
# replace it with the stale snapshot. It is not part of any normal
# workflow — to add content, insert into Mongo directly, don't re-seed.
#
# The backup is a single JSON object with top-level keys per collection:
#   { "glossary": [ ... ], "reviews": [ ... ] }
# with MongoDB Extended JSON (`{"$oid":"..."}`) for ObjectIds — a format
# `mongoimport` handles natively when fed an array via `--jsonArray`.
#
# To proceed you must explicitly confirm (see the guard below).

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
DB="${MONGODB_DB:-a11y_paradise}"
URI="${MONGODB_URI:-mongodb://localhost:27017}"

if [[ -n "${1:-}" ]]; then
  BACKUP="$1"
else
  BACKUP=$(ls -t "$BACKUP_DIR"/backup_*.json 2>/dev/null | head -1)
fi

if [[ -z "${BACKUP:-}" || ! -f "$BACKUP" ]]; then
  echo "No backup file found. Pass a path as the first argument or set BACKUP_DIR." >&2
  exit 1
fi

echo "Would seed from: $BACKUP"
echo "Target:          $URI / $DB"
echo

# --- DESTRUCTIVE-ACTION GUARD ----------------------------------------
# The DB is the source of truth; the loop below DROPS the live
# collections. Require explicit confirmation: either set
# SEED_CONFIRM=wipe-and-reload, or type the confirmation phrase when
# prompted interactively. Refuses to run non-interactively otherwise,
# so it can never be triggered by accident from a pipe or another
# script.
CONFIRM_PHRASE="wipe and reload"
if [[ "${SEED_CONFIRM:-}" != "wipe-and-reload" ]]; then
  cat >&2 <<'WARN'
*********************************************************************
DANGER: this DROPS and reloads the glossary and reviews collections.

The database is the SOURCE OF TRUTH — content is added directly to it,
and this script only restores the one-time Flask-migration snapshot.
Running it now will DESTROY everything added since the migration
(reviews, glossary entries) and replace it with that stale snapshot.
*********************************************************************
WARN
  if [[ ! -t 0 ]]; then
    echo "Refusing to run non-interactively. Set SEED_CONFIRM=wipe-and-reload only if you truly mean to restore the migration snapshot over the live database." >&2
    exit 1
  fi
  printf 'Type "%s" to proceed, or anything else to abort: ' "$CONFIRM_PHRASE" >&2
  read -r REPLY
  if [[ "$REPLY" != "$CONFIRM_PHRASE" ]]; then
    echo "Aborted. Nothing was changed." >&2
    exit 1
  fi
fi
# ---------------------------------------------------------------------

echo "Seeding from: $BACKUP"
echo "Target:       $URI / $DB"
echo

for COLL in glossary reviews; do
  COUNT=$(jq -r ".${COLL} | length" "$BACKUP")
  echo "→ $COLL ($COUNT documents)"
  jq ".${COLL}" "$BACKUP" | mongoimport \
    --uri "$URI" \
    --db "$DB" \
    --collection "$COLL" \
    --drop \
    --jsonArray \
    --quiet
done

echo
echo "Done."
