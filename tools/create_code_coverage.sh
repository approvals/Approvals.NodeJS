#!/bin/bash
# Measure lib/ coverage across the mocha, jest and vitest suites with Istanbul, merge it into one
# HTML report (thresholds from .nycrc), then open the report in Chrome.
set -uo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"
BIN=./node_modules/.bin
PARTS=coverage/parts
REPORT="$REPO_ROOT/coverage/index.html"
failed=0

rm -rf coverage .nyc_output
mkdir -p "$PARTS/mocha" "$PARTS/jest" "$PARTS/vitest" coverage/merge
npm run build || exit $?

"$BIN/nyc" --check-coverage=false --reporter=json --report-dir="$PARTS/mocha" \
  --temp-dir=coverage/.nyc_mocha "$BIN/mocha" || failed=1

NODE_OPTIONS="--experimental-vm-modules --disable-warning=ExperimentalWarning" "$BIN/jest" --runInBand --coverage \
  --coverageReporters=json --coverageDirectory="$PARTS/jest" \
  '--collectCoverageFrom=<rootDir>/lib/**/*.js' || failed=1

"$BIN/vitest" run --coverage.enabled --coverage.provider=istanbul \
  --coverage.reporter=json --coverage.reportsDirectory="$PARTS/vitest" \
  '--coverage.include=lib/**/*.js' || failed=1

# Vitest's locations differ slightly from nyc's and jest's; align them so nyc merge adds the counts.
cp "$PARTS/mocha/coverage-final.json" coverage/merge/mocha.json
cp "$PARTS/jest/coverage-final.json" coverage/merge/jest.json
"$BIN/nyc" merge coverage/merge coverage/reference.json || exit $?
cp "$PARTS/vitest/coverage-final.json" coverage/merge/vitest.json
node tools/align_coverage_maps.ts coverage/reference.json coverage/merge/vitest.json || exit $?
mkdir -p .nyc_output
"$BIN/nyc" merge coverage/merge .nyc_output/combined.json || exit $?

# nyc report also enforces the .nycrc check-coverage thresholds.
"$BIN/nyc" report --reporter=html --reporter=text-summary --report-dir=coverage || failed=1

if [ ! -f "$REPORT" ]; then
  echo "No coverage report was produced at $REPORT" >&2
  exit 1
fi

if [ "$(uname)" = "Darwin" ]; then
  open -a "Google Chrome" "$REPORT" || open "$REPORT"
elif command -v google-chrome >/dev/null; then
  google-chrome "$REPORT" >/dev/null 2>&1 &
elif command -v xdg-open >/dev/null; then
  xdg-open "$REPORT"
else
  echo "Open the coverage report: $REPORT"
fi

echo "Coverage: exit $failed (1 = a suite failed or coverage is below .nycrc thresholds), report $REPORT"
exit "$failed"
