# Front Loaded Reporter

Implemented in `lib/Reporting/FrontLoadedReporter.ts`.

## Purpose

In some environments a diff tool should never open, whatever reporter a test asks for. The main example is an AI
coding agent. A front loaded reporter checks the environment first. If it applies, it takes the place of every other
reporter.

## How a reporter says it applies

The front loaded reporter uses `Reporter.canReportOn(fileName)` (`lib/Core/Reporter.ts`):

- `canReportOn` returns `false` when the reporter does not apply, so normal reporting continues.
- `canReportOn` returns `true` when it applies, so it reports instead of the normal reporter.

## Reporters

- [`AiCodingAgentReporter`](ai_coding_agent_reporter.md): `canReportOn` returns `true` only when an AI coding
  agent is detected.
- `DefaultFrontLoadedReporter`: a `DiffReporterAggregate` holding just `AiCodingAgentReporter`.

## Configuration

`Config` in `lib/config.ts` has a `frontLoadedReporter` option, next to `reporters`:

- If it isn't set, use `DefaultFrontLoadedReporter`.
- `null` turns front loading off.
- A `Reporter` value replaces the default.

It goes through the same `configure` / `getConfig` override chain as the other options.

## Behavior

`withFrontLoadedReporter(config, reporters)` puts the front loaded reporter at the start of the reporter list. If
`frontLoadedReporter` is `null`, it returns the list unchanged. `FileApprover` then uses the first reporter whose
`canReportOn` returns `true`.

It is called from both default reporter loaders:

- `verifyWithControl` in `lib/Approvals.ts`. The Mocha, Jest and Vitest `verify` functions all go through it.
- `verify` in `lib/Providers/BeforeEachVerifierBase.ts`, the `this.verify` style. `getCurrentReporters` still
  returns only the configured reporters.

When the front loaded reporter applies, it replaces the normal reporter, even one passed in explicitly through
`reporters` in the options. A `reporterFactory` passed straight to `verifyWithControl` keeps full control and
skips front loading.

## Test seam

Tests that check a specific reporter would get the AI coding agent reporter instead whenever they run inside an
agent. They turn front loading off with `frontLoadedReporter: null`, either in the options they pass or for a whole
file with `configure({ frontLoadedReporter: null })` and `reset()` afterwards. Tests of front loading itself pass
their own fake reporter as `frontLoadedReporter`, so they don't depend on the environment either.
