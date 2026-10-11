#!/usr/bin/env bash
# Bring this store onto the latest AdsBookCMS.
#
# The store shares no git history with the product, so the tree is replaced, not
# merged: src/, scripts/, docs/ and root files come from the product;
# wrangler.jsonc and public/ stay with the store.
#
# Unlike zanobyshop this install keeps the product's own visual surface, so
# there is no palette step here. If it ever takes a brand, the palette script
# belongs in STORE_SCRIPTS below and gets invoked at the end - not applied by
# hand, or the next sync reverts it.
set -euo pipefail
cd "$(dirname "$0")/.."

git fetch -q product main
REV=$(git rev-parse --short product/main)
echo "product: $REV"

TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
git archive --format=tar product/main | tar -x -C "$TMP"

# Store-owned scripts survive the replace. Listed by name rather than diffed: a
# store script a sync silently deletes is a sync that quietly reverts the store.
STORE_SCRIPTS=(sync-from-product.sh)
mkdir -p "$TMP/keep"
for s in "${STORE_SCRIPTS[@]}"; do
  [ -f "scripts/$s" ] && cp "scripts/$s" "$TMP/keep/$s"
done

rm -rf src docs && cp -r "$TMP/src" src && cp -r "$TMP/docs" docs
rm -rf scripts && cp -r "$TMP/scripts" scripts
for s in "${STORE_SCRIPTS[@]}"; do
  [ -f "$TMP/keep/$s" ] && cp "$TMP/keep/$s" "scripts/$s" && chmod +x "scripts/$s"
done

for f in $(find "$TMP" -maxdepth 1 -type f -printf '%f\n'); do
  case "$f" in
    wrangler.jsonc) continue ;;   # store identity, never overwritten
  esac
  cp "$TMP/$f" "./$f"
done
cp -r "$TMP/public/." public/ 2>/dev/null || true

node scripts/generate-landing-safelist.mjs "$(python3 -c "
import re,pathlib
print(re.search(r'\"database_name\":\s*\"([^\"]+)\"', pathlib.Path('wrangler.jsonc').read_text()).group(1))")" || true
echo "synced to $REV - now: npm run build && wrangler d1 migrations apply <db> --remote && wrangler deploy"
