
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Hello\nWorld" | $DIR/../bin/approvals.js --reporter gitdiff --outdir $DIR --errorOnStaleApprovedFiles false commandlineTest
