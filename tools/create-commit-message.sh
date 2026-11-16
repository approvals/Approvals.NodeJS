#!/bin/bash
# Kit compatibility entry point; preserve the repository's message rules.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$REPO_ROOT/tools/create_message.ts" "$@"
