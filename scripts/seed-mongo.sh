#!/usr/bin/env bash
#
# Seed the local MongoDB from a backup file produced by the Flask CMS.
#
# The backup is a single JSON object with top-level keys per collection:
#   { "glossary": [ ... ], "reviews": [ ... ] }
# with MongoDB Extended JSON (`{"$oid":"..."}`) for ObjectIds — a format
# `mongoimport` handles natively when fed an array via `--jsonArray`.
#
# Re-running drops and reloads each collection, so the local DB always
# matches the chosen backup snapshot.

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
