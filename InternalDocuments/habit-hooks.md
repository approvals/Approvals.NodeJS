# Habit Hooks

Run code-smell sensors with `tools/run-habit-hooks.sh`. The wrapper never installs tools.

## Setup

1. Install Habit Hooks with `brew install habit-hooks/tap/habit-hooks` (includes language plugins).
1. Run `npm ci`; development dependencies include ESLint, knip, ts-morph, and jscpd.
1. Run `habit-hooks init`; it should report nothing missing.

Alternatively install with `uv tool install "habit-hooks[typescript]"`. Preserve any other language
extras/plugins already installed when changing a uv tool environment.

## Run

- `tools/run-habit-hooks.sh lib/Approvals.ts` checks one file, from any working directory.
- `tools/run-habit-hooks.sh --branch master` checks files changed against master.
- `tools/run-habit-hooks.sh --all` checks the configured source scope.

Exit 1 means enforced findings; exit 2 means an incomplete run and must be investigated.
Read the findings as prompts to investigate, not numerical targets.
Use [processes/habit-hooks.process.md](processes/habit-hooks.process.md) only when a sweep is requested.
After each refactoring step, run `./quick_check.sh`; before completing a sweep run `./build_and_test.sh`.

## Scope and limits

`.habit-hooks/config.toml` includes TypeScript library/CLI/tool source and `.mts` tests, excluding
generated declarations and JavaScript. `.jscpd.json` uses weak mode, excludes generated output,
and ignores imports. The scoped jscpd override reports only clones touching a file in scope.

The TypeScript plugin uses the project's ESLint configuration, knip, and ts-morph comment analysis.
`knip.json` declares one knip workspace per npm workspace (root, `test/mocha`, `test/jest`, `test/vitest`),
because knip ignores root entry patterns inside workspaces. Every `lib/**/*.ts` file is an entry: the
package has no `exports` map, so every built `lib` file is importable by consumers. Dependencies used only
by root test configs (`.mocharc.js`, `jest.config.js`) or by tooling (habit-hooks, `tools/create_code_coverage.sh`) are listed in `ignoreDependencies`.
`test/mocha/testPaths.mts` is a declared entry because tests import it as `./testPaths.mjs`, and once built,
knip resolves that to the generated `.mjs` instead of the `.mts` source.
Only ESLint rules enabled in this repository can produce structural findings; the current config
does not enable every size, nesting, or parameter-count rule. Generic sensors add file length and
duplication. These checks cannot establish behavior, API compatibility, test completeness, or whether
a public export used by external npm consumers is dead code. Review such findings before changing code.
Keep public APIs and comments documenting external behavior. Record suspected bugs in
[habit-hooks-sweep-findings.md](habit-hooks-sweep-findings.md).
