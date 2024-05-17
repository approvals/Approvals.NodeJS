#!/bin/bash -e

touch bin/index.js
chmod a+x bin/index.js
sh -ce "$(cat build_and_test.bat)"
