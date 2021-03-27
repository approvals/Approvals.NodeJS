# Priority
* [ ] Fix the method-level config from stomping on the global configuration values.
* [ ] adjust how icdiffReporter (remove use of shelljs).

# V-Next
* [ ] re-evaluate this project on a Windows machine and cleanup...
* [ ] Add support for setting .json file extension (for example)
* [ ] Figure out what file-type version to update to
* [ ] Move tests to GitHub Actions - Windows
* [ ] Look at the all failing test clipboard reporter? SEE: https://github.com/approvals/ApprovalTests.Net/blob/master/src/ApprovalTests/Reporters/AllFailingTestsClipboardReporter.cs


# Done
* [x] Move to GitHub Actions - Linux
* [x] Move to GitHub Actions - Publishing
* [x] Add limit on number of reporters that get launched
* [x] Fix Error message in GeneridDiffReporterBase when not spawnSync (spawn is used). (stderr/out is not logging correctly).
