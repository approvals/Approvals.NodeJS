#!/bin/bash -e

touch bin/index.js
chmod a+x bin/index.js
sh -e -c "$(cat build_and_test.bat)"
