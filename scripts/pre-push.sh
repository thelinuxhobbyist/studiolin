#!/usr/bin/env bash
# Simple pre-push hook script to verify Hugo builds locally before pushing.
# Place this file in your repo and link it into .git/hooks/pre-push:
#   ln -s ../../scripts/pre-push.sh .git/hooks/pre-push && chmod +x .git/hooks/pre-push

set -euo pipefail

echo "Running local Hugo build check..."

# If you rely on the extended version of Hugo (SASS/SCSS), make sure `hugo version` shows 'extended'.
if ! command -v hugo >/dev/null 2>&1; then
  echo "ERROR: hugo is not installed. Install Hugo to use the pre-push check." >&2
  exit 1
fi

HUGO_OUTPUT="$(mktemp -d)"
trap 'rm -rf "$HUGO_OUTPUT"' EXIT

if ! hugo --destination "$HUGO_OUTPUT" --minify >/dev/null 2>&1; then
  echo "ERROR: Hugo build failed. Fix build errors before pushing." >&2
  exit 1
fi

echo "Hugo build succeeded. Proceeding with push."
exit 0
