#!/bin/bash
# Check prerequisites and run sensors; never install or replace tools here.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$REPO_ROOT/node_modules/.bin:$PATH"
command -v habit-hooks >/dev/null || {
  echo "habit-hooks is missing; see InternalDocuments/habit-hooks.md" >&2
  exit 1
}
for detector in node eslint knip jscpd; do
  command -v "$detector" >/dev/null || {
    echo "$detector is missing; run npm ci (and install Node.js)" >&2
    exit 1
  }
done
if [ "$#" -eq 1 ] && [ -f "$1" ]; then
  ABS_FILE="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
  set -- --file "${ABS_FILE#"$REPO_ROOT/"}"
fi
cd "$REPO_ROOT"
node -e 'require.resolve("ts-morph")'
exec habit-hooks "$@"
