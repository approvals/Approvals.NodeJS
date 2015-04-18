
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Hello\nWorld" | $DIR/../bin/index.js --reporter gitdiff --outdir $DIR commandlineTest
