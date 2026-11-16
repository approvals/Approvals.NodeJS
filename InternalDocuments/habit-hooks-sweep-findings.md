# Habit-hooks sweep findings

Possible bugs noticed during the habit-hooks sweep. They are logged here, not fixed, because the sweep only refactors.
Turn confirmed ones into issues, each with its own test and fix, on a separate branch.

<!-- 1. `path/to/File.java` `method()`: what looks wrong, and how to confirm it. -->

1. `lib/Approvals.ts` `verifyAndScrub()`: it was exported (`verifyAndScrub: verifyAndScrub` in `module.exports`) before commit a5d46efd ("Approvals.exports"), but is no longer exported. README.md and the JSDoc examples (including the one on `verifyAsJSON`) still tell users to call `approvals.verifyAndScrub(...)`. To confirm, import `verifyAndScrub` from the package and see that it is `undefined`.
1. `bin/index.ts` `main()`: minimist aliases `r` to `reporters`, but the code reads `argv.reporter`, so `-r gitdiff` (and `--reporters gitdiff`) are silently ignored; only `--reporter` works. To confirm, run `echo hi | approvals t -r gitdiff --verbose` and see `reporters:  undefined`.
1. `bin/index.ts` `main()`: `es.mapSync` calls `configure`/`verify` once per stdin chunk, so input larger than one chunk (about 64KB) is verified piecewise against the same approved file. To confirm, pipe a 200KB file into `approvals bigTest` and compare the received file with the input.
