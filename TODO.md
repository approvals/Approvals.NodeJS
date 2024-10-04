# Priority

- [x] Fix the method-level config from stomping on the global configuration values.
- [ ] adjust how icdiffReporter (remove use of shelljs).

# V-Next

- [ ] Add support for setting .json file extension (for example)
- [ ] Figure out what file-type version to update to
- [ ] Look at the all failing test clipboard reporter? SEE: https://github.com/approvals/ApprovalTests.Net/blob/master/src/ApprovalTests/Reporters/AllFailingTestsClipboardReporter.cs
- [ ] Research vimdiff reporter (does it even work?)
- [ ] Add [prettier](https://prettier.io/docs/en/install.html) and format project source code

# Done

- [x] Move tests to GitHub Actions - Windows
- [x] re-evaluate this project on a Windows machine and cleanup...
- [x] Move to GitHub Actions - Linux
- [x] Move to GitHub Actions - Publishing
- [x] Add limit on number of reporters that get launched
- [x] Fix Error message in GeneridDiffReporterBase when not spawnSync (spawn is used). (stderr/out is not logging correctly).



- Chai 5
  - Make test files ESM
    - [x] Replace require with import
    - [x] Update gulp and jest configuration to run tests in .mjs files
      - [x] Update gulp and jest configuration to only run on compiled output first!
        It's currently running at least the Jest tests twice.
    - [x] Change ts module to nodenext
    - Add extension to relative imports
    - Handle ES modules being stubbed in postRunCleanupTests.ts
    - Fix Jest tests, module mocking etc
      - jest.config.js: transform: {}
      - NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" npx jest
      - [x] ReferenceError: __dirname is not defined
        [[https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d][How to fix “__dirname is not defined in ES module scope”]]

