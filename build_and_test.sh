#!/bin/bash -e

started=$SECONDS
trap 'result=$?; echo "Build and test: $((SECONDS - started))s, exit $result"; exit "$result"' EXIT

touch bin/index.js
chmod a+x bin/index.js
mise install
mise run deps
mise run build
mise exec -- npm test --silent -- "$@"
