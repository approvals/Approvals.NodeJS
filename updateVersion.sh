#!/bin/bash -e

version_with_v="$1"
version=$(echo "$version_with_v" | sed -e s/v//)
TEMP_FILE=$(mktemp)
jq ".version |= \"$version\"" package.json > "$TEMP_FILE" || exit 1
mv "$TEMP_FILE" package.json

echo "Setting npm version in package.json to: $version "
