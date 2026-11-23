# Suggested Test Coverage Scenarios

Source: `.nyc_output/combined.json` (mocha + jest + vitest merged), measured 2026-11-23.
Line numbers below refer to the compiled `lib/**/*.js` that Istanbul measures; function names refer to the `.ts` source.

## Summary

| Metric     | Now    | `.nycrc` | Gap (count)  | Now, without TS emit helpers |
| ---------- | ------ | -------- | ------------ | ---------------------------- |
| Statements | 77.97% | 86%      | +156 of 1934 | 84.2% (+26 needed)           |
| Branches   | 68.93% | 68%      | met          | 72.8%                        |
| Functions  | 74.26% | 86%      | +57 of 478   | 80.3% (+20 needed)           |
| Lines      | 80.40% | 86%      | +98          | 84.5% (+22 needed)           |

**Main finding:** 195 of the 426 uncovered statements and 55 of the 123 uncovered functions are not our code.
They are TypeScript's `__createBinding` / `__setModuleDefault` / `__importStar` helpers, emitted at the top of the 13 files that use `import * as x from ...`.
They include fallback paths (`Object.create` missing, `Object.getOwnPropertyNames` missing) that no test can reach on a modern Node.
Until those are removed from the measurement, **the functions threshold can't reach 86%** even if every reachable function gets a test (about 85% at most).

Top files by real gap (helpers excluded):

| File                                       | Uncovered stmts | Uncovered fns | What is missing                              |
| ------------------------------------------ | --------------- | ------------- | -------------------------------------------- |
| `Reporting/Reporters/visualstudioReporter` | 20 (all)        | 7             | Windows + `edge` package only                |
| `Reporting/GenericDiffReporterBase`        | 17              | 4             | async `spawn` output handling, ctor guard    |
| `Reporting/Reporters/nodediffReporter`     | 17              | 4             | `report`, `canReportOn`, `colorByChangeType` |
| `AUtils`                                   | 17              | 1             | Windows Program Files search, error paths    |
| `Providers/Mocha/MochaApprovals`           | 15              | 4             | `verifyAsJson`, `verifyAll`, `it2`           |
| `Approvals`                                | 12              | 3             | deprecated reporters array, exit-time report |
| `Providers/Vitest/VitestReporter`          | 11 (all)        | 3             | never referenced                             |
| `Reporting/ReportLaunchingCircuitBreaker`  | 10              | 4             | the "limit exceeded" path                    |
| `Reporting/ReportByOpeningTheReceivedFile` | 10 (all)        | 3             | never referenced                             |
| `Reporting/Reporters/copycommandReporter`  | 8               | 2             | `report`, `canReportOn`                      |
| `Providers/Vitest/VitestApprovals`         | 7               | 2             | `verifyAsJson`, `verifyAll`                  |

## Step 0: decide how to treat the TS emit helpers (biggest gain, no tests)

⭐ 1: Replace `import * as x from "..."` with default or named imports in the 13 files (`StringWriter`, `AUtils`, `config`, `Approvals`, `GenericDiffReporterBase`, `BinaryWriter`, `ApprovedFileLog`, `FailedFileLog`, `BeforeEachVerifierBase`, `diffmergeReporter`, `MochaApprovals`, `VitestApprovals`, `JestApprovals`). With `esModuleInterop` this emits only `__importDefault`, which is fully covered. Some files (e.g. `nodediffReporter`) already use `import fs from "fs"`. Small, mechanical refactor; no new dependency. Gain: about +6 points statements and functions, +4 lines.
❌ 2: `"importHelpers": true` plus a `tslib` dependency. Same gain, but adds a runtime dependency to the published package.
❌ 3: Turn on source maps and have Istanbul remap to `.ts`. Most accurate, but has to be set up in nyc, jest and vitest plus `tools/align_coverage_maps.mts`. More moving parts.
❌ 4: Lower `.nycrc` thresholds. Hides the problem instead of fixing it.

## Prioritised scenarios

Impact figures are approximate counts of statements (s) / functions (f) gained, helpers excluded.

### Tier 1: most gain per effort

1. **`nodediffReporter.report` + `ConsoleUtils`** (`nodediffReporter.js` 10-36, `ConsoleUtils.js` 11-18). ~20 s / 7 f.
   Given a temp approved file `"hello world"` and received file `"hello there"`, when `new NodeDiffReporter().report(approved, received, {})` runs with `process.stdout.write` and `console.log` captured, then `verify` the captured output. It shows added (green), removed (red) and unchanged (gray) parts. Also: `canReportOn` is true for a text file and false for `UnapprovedImage.png`. A second case where the approved file does not exist yet, so the empty file gets created.
   Suite: mocha (`test/mocha/Reporting/Reporters/`, sinon sandbox like `WebStormReporterTests`). ANSI codes in the output are fine to approve; or wrap the colour functions so they show up as `[green]...[/green]`.
1. **`ReportLaunchingCircuitBreaker.check` limit exceeded** (`ReportLaunchingCircuitBreaker.js` 16-33, `FinalMessages.js` 9-13, `GenericDiffReporterBase.js` 119). ~12 s / 6 f, and covers more of nodediff.
   Given `setMaxLaunch(0)`, when a `GenericDiffReporterBase` subclass with stubbed `spawn` reports, then `spawn` is not called, nodediff output is written, and `FinalMessages.getMessages()` holds a `maxLaunches` message. Also: under the limit, `check` returns false and `currentCount` goes up by 1.
   Suite: mocha. Caution: `maxLaunch`, `currentCount`, `reroutedCount` and `FinalMessages` are module-level with no reset, so the test must restore `setMaxLaunch(10)`, and the WARNING report will print at process exit (see open questions).
1. **`GenericDiffReporterBase.spawn` async output** (`GenericDiffReporterBase.js` 81-103) plus the constructor guard (50), `canImageDiff` true (76), and the `spawnSync` stderr branch (113). ~16 s / 4 f.
   Given a reporter whose `exePath` is `process.execPath` running a small script that writes to stdout and stderr, when `spawn` is called and the `close` event fires, then `console.log` got both blocks. Verify the captured log. `new GenericDiffReporterBase("")` throws "Argument name missing". A subclass with `canImageDiff() === true` can report on a binary file.
   Suite: mocha, in `GenericDiffReporterBaseTests.mts`. Reuse the real-child-process pattern from `WebStormReporterTests` ("passes diff arguments through a real child process").
1. **Mocha `verifyAsJson` / `verifyAll`** (`MochaApprovals.js` 85-93). ~6 s / 2 f.
   Given `setNamer(this)` in `beforeEach`, when `verifyAsJson({a: 1, b: "bar"})` and `verifyAll("numbers", [1, 2, 3], n => ...)` run, then they create approved `.json` / `.txt` files. Today the mocha tests only use `this.verifyAsJSON` from `BeforeEachVerifierBase`.
   Suite: mocha, `test/mocha/Providers/Mocha/MochaTests.mts`.
1. **Vitest `verifyAsJson` / `verifyAll`** (`VitestApprovals.js` 57-65). ~6 s / 2 f.
   Same as above in `test/vitest/Vitest.test.mts`. Jest already covers its equivalents in `test/jest/Providers/Jest.test.mts`.

Tier 1 total: ~60 s / 21 f. With Step 0 done, that gives about **S 88.4%, F 86.4%, L 88.7%**: all thresholds met, but functions only just.

### Tier 2: cheap, small gains (adds safety margin on functions)

1. **`vscodeReporter.report` / `codiumReporter.report`** (16-22 each). ~8 s / 2 f. Given stubbed `spawn` and circuit breaker (same as the WebStorm "launches a diff" test), when `report` runs, then `cmdArgs` is `["-n", "--diff", received, approved]` and `detached: true` is passed. Mocha.
1. **`copycommandReporter`** (8-35). ~8 s / 2 f. Stub `execSync` on `node:child_process`: on darwin it pipes `cp '<received>' '<approved>'` into `pbcopy`. Stub `process.platform` to `"aix"` and the fallback command is logged. Verify the captured calls. Mocha.
1. **`Scrubbers.templates`** (`Scrubbers.js` 51-58). 3 s / 4 f. Apply each template scrubber to a sample string (`"your pattern here: abcd"`, a date `2014/05/13 16:30:59.786`) and `verify` the result. Jest, `Scrubbers.test.mts`.
1. **`ReporterFactory` / `multiReporter` / `DiffReporterAggregate` error paths**. ~8 s / 3 f. `loadAllReporters([42])` throws "Unknown reporter"; `new MultiReporter("p4merge")` (not an array) throws; `MultiReporter.canReportOn` with two custom reporters (one says no); exactly one failing reporter rethrows its original error; an aggregate with no reporter that can report throws "No reporter found!". Mocha, existing `multiReporterTests` / `ReporterFactoryTests`.
1. **`AUtils` edge paths** (46, 56, 69, 77, 117-144). ~17 s / 1 f. `createEmptyFileIfNotExists("x.png")` copies the placeholder image; `assertFileExists("missing")` throws; `isBinaryFile` on the PNG buffer is true; `searchForExecutable("Folder", "tool")` with `platform.isWindows` stubbed true and `fs.existsSync` stubbed to match `C:/Program Files (x86)/Folder/tool.exe`. Mocha, `AUtilsTests.mts`. Good value per test.
1. **`Approvals.verify` with a reporters array** (`Approvals.js` 186-207). ~4 s / 1 f. Passing `["donothing"]` as the 4th argument still works and logs the deprecation message with `console.error`. Mocha.
1. **Small ones, 1-2 each:** `Options.withFileExtention` (deprecated misspelling) delegates to `withFileExtension`; `Options.getNamer()` default; `SimpleLogger.registerLogger` captures output; `LoggingInstance` default logger/timer (log once without `logToString`); `DateScrubber.getScrubberFor("not a date")` throws a message listing supported formats (verify it); `StringWriter` / `BinaryWriter` create a missing directory; `BeforeEachVerifierBase` invalid directory error; `MochaNamer` missing-context errors; `config.getHomeApprovalConfig` with invalid YAML (stub `os.homedir`); `postRunCleanup` calls `shouldIgnoreStaleApprovedFile`.

Tier 1 + Tier 2, with Step 0 done: about **S 92.8%, F 91.9%, L 93.0%**.
Tier 1 + Tier 2 **without** Step 0: about S 84.5%, F 82.6%, L 87.3%. Only lines passes.

### Tier 3: costly or awkward

1. **Exit-time "Approvals Report: WARNING!"** (`Approvals.js` 90-95). Lives in a `process.on("exit")` handler. Testing it needs the handler pulled out into a named function (a source change) or a child-process test.
1. **`Approvals` global `beforeEach` that throws "You must call either .mocha()"** (72-75). Needs a mocha suite where `.mocha()` was never called; hard to isolate in the shared mocha run.
1. **`JestSetup.initializeGlobalsForJest` / `FailedFileLog.forceClearFileLog`.** Runs as jest `globalSetup`, which Istanbul does not instrument. Calling it from a test clears the shared log files, so it has side effects.

## Consider excluding or deleting (decisions, not actions)

1. `Reporting/Reporters/visualstudioReporter` (20 s / 7 f, 0% covered). Needs Windows plus the `edge` npm package, which is not a dependency. `ReporterFactoryTests` already skips it "due to edge". Probably broken for everyone. Delete it, or exclude it from coverage.
1. `Providers/Vitest/VitestReporter` (11 s / 3 f, 0%). Not referenced anywhere in `lib`, tests or the readme. Could be reached by deep import, since `package.json` has no `exports`. Delete it, or test it in vitest (`report` fails a vitest expectation when the files differ).
1. `Reporting/ReportByOpeningTheReceivedFile` (10 s / 3 f, 0%). Not referenced anywhere. Delete it, or test it with `exec` stubbed.
1. `MochaApprovals.it2` (6 s / 2 f). Not used anywhere. Looks like an experiment.
1. `FinalMessages.addMessage` and `Utilities/Logger/Wrapper.ThreadedWrapper`. Not used anywhere.
1. `Core/Reporter.js`, `Core/Writer.js`. Interface-only modules (1 empty statement each), only imported for types. Exclude them in `.nycrc`, or ignore them as noise.
1. Windows-only branches in `AUtils.searchForExecutable`, `beyondcompareReporter`, `tortoisemergeReporter`, `p4mergeReporter`. These can be tested by stubbing `platform.isWindows` (the WebStorm tests already do this), so test rather than exclude.

## Open questions

1. Is Step 0 (dropping `import * as`) acceptable as a refactor before adding tests? Without it, or another way to drop the helpers, the 86% functions threshold is out of reach.
1. Are `visualstudio`, `VitestReporter` and `ReportByOpeningTheReceivedFile` public API that users deep-import? That decides delete versus test.
1. Should `ReportLaunchingCircuitBreaker` and `FinalMessages` get a reset method for tests? Without one, the limit-exceeded test leaks state into the rest of the run and makes the exit report print a WARNING.
1. Should the coverage gate also check branches above the current 68%? After Step 0 it measures 72.8%, and these scenarios raise it further.
1. The readme reporter table describes `copycommand` as "git diff (console diff)". That looks like a copy-paste slip worth fixing when its test is written.
