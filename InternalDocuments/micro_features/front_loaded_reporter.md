# Front Loaded Reporter

Status: **not implemented yet**.

## Purpose

In some environments a diff tool should never open, whatever reporter a test asks for. The main example is an AI
coding agent. A front loaded reporter checks the environment first. If it applies, it takes the place of every other
reporter.

## How a reporter says it applies

The front loaded reporter uses `Reporter.canReportOn(fileName)` (`lib/Core/Reporter.ts`):

- `canReportOn` returns `false` when the reporter does not apply, so normal reporting continues.
- `canReportOn` returns `true` when it applies, so it reports instead of the normal reporter.

## Reporters

- [`AiCodingAgentReporter`](ai_coding_agent_reporter.md) (new): `canReportOn` returns `true` only when an AI coding agent is detected.
- `DefaultFrontLoadedReporter`: just `AiCodingAgentReporter`.

## Configuration

Add a `frontLoadedReporter` option to `Config` in `lib/config.ts`, next to `reporters`:

- If it isn't set, use `DefaultFrontLoadedReporter`.
- `null` turns front loading off.
- A `Reporter` value replaces the default.

It goes through the same `configure` / `getConfig` override chain as the other options.

## Behavior

The reporter is chosen in the default loader in `verifyWithControl` (`lib/Approvals.ts`):

1. Load the normal reporter from `options.reporters`, as today.
1. If `frontLoadedReporter` is `null`, use the normal reporter.
1. Otherwise use `new DiffReporterAggregate([frontLoaded, normal])`, which picks the first reporter whose
   `canReportOn` returns `true`.

When the front loaded reporter applies, it replaces the normal reporter, even one passed in explicitly through
`reporters` in the options. A `reporterFactory` passed straight to `verifyWithControl` keeps full control and
skips front loading.
