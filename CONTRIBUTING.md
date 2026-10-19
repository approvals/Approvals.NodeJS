## Contributing

### Dependencies

- [`node && npm`](http://nodejs.org)

### Getting started.

```bash
git clone https://github.com/approvals/Approvals.NodeJS.git
cd Approvals.NodeJS
./build_and_test.sh
```

To build and run just one framework's suite (plus lint), pass `--framework`:

```bash
./build_and_test.sh --framework mocha
./build_and_test.sh --framework jest
./build_and_test.sh --framework vitest
```

On Windows, use `build_and_test.bat --framework mocha` (or `jest` / `vitest`).
These commands still install development dependencies and build the library,
but run only the selected isolated suite. After building,
`npm test -- --framework jest` selects a suite without rebuilding.

In lieu of a formal styleguide, take care to maintain the existing coding style, most style rules enforce by [eslint](http://eslint.org/). Add unit tests for any new or changed functionality. Run `./build_and_test.sh` before submitting changes.

The suites live in `test/mocha`, `test/jest`, and `test/vitest`, each with its own
framework dependencies. `npm test` runs lint, a small framework-free core check,
and each full suite once in a temporary directory. Each directory contains the
built library and only that suite's framework; the runner asserts that the other
frameworks are absent before starting tests. There is no second smoke-test run
or rebuild during testing.

The root install supplies all workspaces for compilation and development.
Isolated installs reuse versions from `package-lock.json` and require npm cache
or registry access. Build first with `npm run build`; then run all suites with
`npm test`, or one with `npm run mocha`, `npm run jest`, or `npm run vitest`.
JUnit reports and any received files are copied back into the repository before
the temporary directories are removed. `npm run coverage` runs Mocha in isolation
and copies its coverage report back too.

### How to release a new version

Releases are created through GitHub. GitHub Actions publishes the package to npmjs.org automatically.

1. Make sure the changes to release are merged into `master` and the Build & Test workflow has passed.
2. Create a version tag on the commit to release, using the format `vX.Y.Z` (for example, `v7.5.9`).
3. Create and publish a [GitHub release](https://github.com/approvals/Approvals.NodeJS/releases/new) for that tag, including release notes.
4. Check that the **npm Publish** workflow succeeds in [GitHub Actions](https://github.com/approvals/Approvals.NodeJS/actions), then verify the new version on [npmjs.org](https://www.npmjs.com/package/@approval-tests/approvals).

Creating the release triggers the [publishing workflow](.github/workflows/npm-publish.yml). It builds and tests the tagged commit, updates `package.json` and `package-lock.json` to the version from the tag, commits those version updates to `master`, and publishes the package to npm.
