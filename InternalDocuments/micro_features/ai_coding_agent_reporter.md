# AI Coding Agent Reporter

Implemented in `lib/Reporting/Reporters/aicodingagentReporter.ts`.

## Purpose

An AI coding agent can't see a diff tool that opens on screen, but it can read console output. When an agent runs the
tests, this reporter prints what the agent needs to fix or approve the failure instead of launching a diff tool.

## Detection

An agent is detected when any of these environment variables is set:

| Variable                 | Agent            |
| ------------------------ | ---------------- |
| `AI_AGENT`               | generic opt-in   |
| `APPROVAL_TESTS_AGENT`   | generic opt-in   |
| `CLAUDECODE`             | Claude Code      |
| `CLAUDE_CODE_ENTRYPOINT` | Claude Code      |
| `CODEX_SANDBOX`          | OpenAI Codex CLI |
| `CURSOR_AGENT`           | Cursor           |
| `CURSOR_TRACE_ID`        | Cursor           |
| `GEMINI_CLI`             | Gemini CLI       |
| `OPENCODE`               | opencode         |

- A variable counts as set when it exists, isn't blank, and isn't a false value. The false values are `0`, `f`,
  `F`, `false`, `FALSE` and `False`.
- To opt out, a user sets the variable to a false value, for example `CLAUDECODE=0`.
- `AiCodingAgentReporter.ENVIRONMENT_VARIABLES` is a public, mutable static array, so users can add agents that
  aren't listed.

## Behavior

`AiCodingAgentReporter` implements `Reporter` (`lib/Core/Reporter.ts`) and lives in
`lib/Reporting/Reporters/aicodingagentReporter.ts`. That way `ReporterFactory` can load it by name
(`"aicodingagent"`).

- `canReportOn(fileName)` returns `true` only when an agent is detected. This is how it works as a
  [front loaded reporter](front_loaded_reporter.md).
- `report(approved, received)` prints the report with `console.log` and never launches a process.

## Test seam

The constructor takes the environment to read, and defaults to `process.env`:

```ts
new AiCodingAgentReporter({ CLAUDECODE: "1" }).canReportOn(); // true
new AiCodingAgentReporter({}).canReportOn(); // false
```

Tests pass a plain map instead of changing `process.env`, so they give the same result whether or not they run
inside an agent. The report text comes from the static `AiCodingAgentReporter.getReportText(approved, received)`,
so tests can approve it without capturing `console.log`.

## Output format

````text
# APPROVAL TEST FAILED
  approved: /abs/path/test.approved.txt
  received: /abs/path/test.received.txt
  approve_with: mv -f "/abs/path/test.received.txt" "/abs/path/test.approved.txt"

## APPROVED
```
<approved file contents>
```

## RECEIVED
```
<received file contents>
```
----------------------------------------
````

- Every path is absolute.
- `approve_with` is a `mv -f "<received>" "<approved>"` command.
- If a file can't be read (for example, the approved file doesn't exist yet), its contents are replaced with
  `** Error reading APPROVED file **` or `** Error reading RECEIVED file **`.

## Integration

- By default it is the only reporter in the [front loaded reporter](front_loaded_reporter.md), so it runs
  before whatever reporter a test uses, even one the test names itself.
- It can also be used directly: `{ reporters: ["aicodingagent"] }` or
  `{ reporters: [new AiCodingAgentReporter()] }`.
