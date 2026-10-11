#!/usr/bin/env bash
# Bring this store onto the latest AdsBookCMS.
#
# Since 2026-10-12 the store shares history with the product (joined at
# product d19231b, 1.5.2), so an update is an ordinary merge - RELEASE.md §7.
# The tree replace this script used to perform is retired: it would now throw
# away every store change the merge base already accounts for.
set -euo pipefail
cd "$(dirname "$0")/.."

# wrangler.jsonc and the deploy workflow keep this store's copy (.gitattributes).
git config merge.keepours.name "keep the install's own copy"
git config merge.keepours.driver true

git fetch -q product main
REV=$(git rev-parse --short product/main)
git merge --no-ff product/main -m "Merge product/main $REV into permatamall"

npm run route-map >/dev/null
git status --short
echo "merged product $REV - next: npm ci (if the lockfile moved), npm run check, npm test, npm run build; commit anything listed above; push main (it deploys)"
