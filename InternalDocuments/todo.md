# To do

## Commit messages

- [ ] Check which files a commit actually changes before suggesting its notation.
  - [ ] Only tests changed: suggest (or enforce) `. t`.
  - [ ] Only documentation changed: suggest (or enforce) `. d`.

## Testing

- [ ] Raise test coverage.
- [ ] Add a mutation testing run, so we measure how complete the tests are (including branches), not just
      how much code they execute.

## Bugs

- [ ] Go through [habit-hooks-sweep-findings.md](habit-hooks-sweep-findings.md) and fix the confirmed bugs,
      each with its own test.

## Refactoring tools

- [ ] Make deterministic refactors possible, using one of:
  - an existing ReSharper MCP server
  - a new ReSharper MCP server
  - a refactoring CLI

## Reporters

use the diff tools repo
add intelij reporter

## Feature map
