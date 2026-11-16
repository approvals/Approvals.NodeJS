#!/bin/bash
# Fast local feedback; full release validation uses build_and_test.sh.
set -euo pipefail
cd "$(dirname "$0")"
started=$SECONDS
trap 'result=$?; echo "Quick check: $((SECONDS - started))s, exit $result"; exit "$result"' EXIT
npm run build
npm run lint
./node_modules/.bin/mocha
NODE_OPTIONS=--experimental-vm-modules ./node_modules/.bin/jest --runInBand
./node_modules/.bin/vitest run
