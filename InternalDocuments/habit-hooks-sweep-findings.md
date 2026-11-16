# Habit-hooks sweep findings

Possible bugs noticed during the habit-hooks sweep. They are logged here, not fixed, because the sweep only refactors.
Turn confirmed ones into issues, each with its own test and fix, on a separate branch.

<!-- 1. `path/to/File.java` `method()`: what looks wrong, and how to confirm it. -->

1. `lib/Approvals.ts` `verifyAndScrub()`: it was exported (`verifyAndScrub: verifyAndScrub` in `module.exports`) before commit a5d46efd ("Approvals.exports"), but is no longer exported. README.md and the JSDoc examples (including the one on `verifyAsJSON`) still tell users to call `approvals.verifyAndScrub(...)`. To confirm, import `verifyAndScrub` from the package and see that it is `undefined`.
1. `bin/index.ts` `main()`: minimist aliases `r` to `reporters`, but the code reads `argv.reporter`, so `-r gitdiff` (and `--reporters gitdiff`) are silently ignored; only `--reporter` works. To confirm, run `echo hi | approvals t -r gitdiff --verbose` and see `reporters:  undefined`.
1. `bin/index.ts` `main()`: `es.mapSync` calls `configure`/`verify` once per stdin chunk, so input larger than one chunk (about 64KB) is verified piecewise against the same approved file. To confirm, pipe a 200KB file into `approvals bigTest` and compare the received file with the input.
1. `test/mocha/Providers/Mocha/Typescript/MochaTests.mts`: a commented-out test `it2("verify approvals", ...)` called `verify("Hello From Approvals")` with the note "get the test name of the current mocha test", recording an intent to verify from a custom `it` wrapper (naming without `setNamer(this)`). It was removed in the sweep; to confirm whether this is still wanted, check whether `verify` can name a test declared through a wrapper around `it`.
1. `lib/ManualNamer.ts` constructor: it reassigns `basePath` and `name` from the raw arguments after `super()`, which undoes `Namer`'s `|| ""` defaults and its trailing-`.` stripping (a removed comment wrongly called these lines redundant). So `verify(dir, "name.", ...)` yields `name..approved.txt` while other namers yield `name.approved.txt`. To confirm whether this is intended, call `verify(__dirname, "x.", "data")` and inspect the received file name.
1. `lib/Utilities/Logger/LoggingInstance.ts` `warning()`: a removed `// todo: grab stack trace` recorded intended-but-missing work. `logStackTraces` is public and tests set it to `true`, but both branches print `exception.toString()`, so no stack trace is ever logged. To confirm, set `logStackTraces = true`, call `SimpleLogger.warning(new Error("x"))`, and see only `Error: x`.
