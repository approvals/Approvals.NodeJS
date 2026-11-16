# Approvals.NodeJS

Approval-testing library published as `@approval-tests/approvals`. TypeScript source lives in
`lib/`, CLI source in `bin/`, and framework suites in `test/mocha`, `test/jest`, and `test/vitest`.
`npm run build` emits ignored JavaScript and declaration files beside source.

- Full validation: `./build_and_test.sh` (build, lint, framework-free core and isolated framework suites).
- Local feedback: `./quick_check.sh`; see [QuickCheck.md](QuickCheck.md).
- Smell sensors: `tools/run-habit-hooks.sh`; see [habit-hooks.md](habit-hooks.md).
- Commit messages: `node tools/create_message.ts <risk> <intention> "<description>"`.

Kit source: https://github.com/LearnWithLlew/AiInLegacyCode/tree/9bc43b24b8c7f03e0bb6de0828397a7b5d7c637a/kit
Installed for TypeScript; project commit-message rules take precedence over the template.
Installing the kit does not start a refactoring sweep.
