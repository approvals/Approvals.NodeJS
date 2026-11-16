# habit-hooks

Habit Hooks is a code-smell sensor tool, run via `tools/run-habit-hooks.sh`.
It scans files for structural smells (long methods, deep nesting, complexity, too many
parameters, empty catches, oversized files, duplication) and reports them as findings with
instructions on how to clean. Follow those instructions and clean up the code.
See `InternalDocuments/habit-hooks.md` for setup.

## Usage

```
tools/run-habit-hooks.sh lib/Approvals.ts   # single file
tools/run-habit-hooks.sh --branch master       # changed files vs a branch
tools/run-habit-hooks.sh --all               # whole scanned scope
```

## Steps

Note: If multiple files are specified, do each one in a sub-agent, one at a time sequentially.

For each File:

1. Check Git Status that we are checked in, otherwise stop.
1. Run Habit Hooks.
1. Apply one fix.
1. Format the changed file the way the project does, then run `./quick_check.sh` (see `InternalDocuments/QuickCheck.md`).
   If it fails, fix or revert with `git revert`, never `git reset --hard`.
   Don't pipe `quick_check.sh` into `tail`/`grep`; that hides its exit code.
1. Commit the change (We will review them later) with the message from
   `node tools/create_message.ts proven refactor "<short-message>"` (gives `- r <short-message>`).
   If every changed file is a test (under `test/`), use
   `node tools/create_message.ts completely_safe test "<short-message>"` instead (gives `. t <short-message>`):
   a test-only change can't break production, so it gets the safer notation.
1. Repeat from "Run Habit Hooks" until the remaining findings are worth leaving.
   Make at most 5 commits per file; at most 3 if one quick check takes over 5 minutes.
1. When done with the file, run the full static check (`npm run lint` and `npm run build`).

## Fixes

Don't check in with the user about any of the fixes. We have source control.
Fixes are refactorings: they must not change behavior. Keep the order of side effects, locking,
and null handling exactly as it was. Don't change the signatures of public or protected methods.

If you find a potential product bug, don't fix it, log it in `InternalDocuments/habit-hooks-sweep-findings.md`

## Smells are prompts to investigate, not limits

Findings point at places worth looking at. They are not rules to satisfy or thresholds to get under.
The goal is well-designed code: classes with a single responsibility, small functional methods, no duplication.

- A size finding means: investigate. Does the class have one responsibility? Are its methods small? Is there duplication?
  If the class does one thing well, its size is fine; a long class can be the right class.
- Never shuffle code between files just to reduce a count. That hides the smell without improving the design.
- Extract a new class only for a genuine second responsibility, not to shrink a file.
- Do shrink long methods, remove duplication, and prefer functional style.
- Two similar blocks that end differently may be two ideas; don't force a shared abstraction.
- Public and protected methods are API; don't change their signatures.
- It is fine to leave a finding unresolved; say which ones and why in the report.

## Specific Additional Instructions for types of Fixes

### Comments

If the comment is doing real work, fix the name so that the comment is redundant and then remove the comment.

Keep a comment when it records an external quirk (runtime, library, API behavior) or points to a spec or issue; names can't carry those.

### Swallowed exceptions

An empty catch is often deliberate (e.g. best-effort close). Don't change what is thrown or logged;
if it is deliberate, say why in a short comment in the catch.
The sensor still flags a commented catch; report it as deliberately left.
