#!/bin/bash -e

version_with_v="$1"
version="${version_with_v#v}"
npm version "$version" --no-git-tag-version --allow-same-version

echo "Setting npm version in package.json and package-lock.json to: $version"
