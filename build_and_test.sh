#!/bin/bash -e

touch bin/index.js
chmod a+x bin/index.js
mise install
mise run deps
mise run build
mise exec -- npm test -- "$@"
