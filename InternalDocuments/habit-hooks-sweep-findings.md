# Habit-hooks sweep findings

Possible bugs noticed during the habit-hooks sweep. They are logged here, not fixed, because the sweep only refactors.
Turn confirmed ones into issues, each with its own test and fix, on a separate branch.

<!-- 1. `path/to/File.java` `method()`: what looks wrong, and how to confirm it. -->

1. `lib/Approvals.ts` `verifyAndScrub()`: it was exported (`verifyAndScrub: verifyAndScrub` in `module.exports`) before commit a5d46efd ("Approvals.exports"), but is no longer exported. README.md and the JSDoc examples (including the one on `verifyAsJSON`) still tell users to call `approvals.verifyAndScrub(...)`. To confirm, import `verifyAndScrub` from the package and see that it is `undefined`.
