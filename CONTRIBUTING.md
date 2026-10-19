## Contributing

### Dependencies

- [`node && npm`](http://nodejs.org)

### Getting started.

```bash
git clone https://github.com/approvals/Approvals.NodeJS.git
cd Approvals.NodeJS
./build_and_test.sh
```

In lieu of a formal styleguide, take care to maintain the existing coding style, most style rules enforce by [eslint](http://eslint.org/). Add unit tests for any new or changed functionality. Run `./build_and_test.sh` before submitting changes.

`npm run test:projects` builds and packs Approvals, then installs it in temporary
consumer projects with only Mocha, Jest, or Vitest. It also checks installation
without any framework and asserts that unrelated frameworks and `ts-jest` are
absent. These checks run as part of `npm test` and require npm registry access.
The projects in `test-projects/` each declare only their own test framework.

The existing suites live in `test/mocha`, `test/jest`, and `test/vitest`.
Each is an npm workspace with its own framework dependencies. The root install
installs all workspaces for development; run one suite with `npm run mocha`,
`npm run jest`, or `npm run vitest`.

### How to release a new version

Releases are created through GitHub. GitHub Actions publishes the package to npmjs.org automatically.

1. Make sure the changes to release are merged into `master` and the Build & Test workflow has passed.
2. Create a version tag on the commit to release, using the format `vX.Y.Z` (for example, `v7.5.9`).
3. Create and publish a [GitHub release](https://github.com/approvals/Approvals.NodeJS/releases/new) for that tag, including release notes.
4. Check that the **npm Publish** workflow succeeds in [GitHub Actions](https://github.com/approvals/Approvals.NodeJS/actions), then verify the new version on [npmjs.org](https://www.npmjs.com/package/@approval-tests/approvals).

Creating the release triggers the [publishing workflow](.github/workflows/npm-publish.yml). It builds and tests the tagged commit, updates `package.json` and `package-lock.json` to the version from the tag, commits those version updates to `master`, and publishes the package to npm.
