# AGENTS.md

Rules for AI coding agents working in this repo. Merge these with any AGENTS.md or CLAUDE.md the project
already has, and keep the project's own guidance.

**ALWAYS** start every reply with 🍀 + space. This is a per-message rule, not a one-time setting — check it before sending every single reply, including short ones and replies under concise/terse output modes (brevity means shorter sentences, not dropping this prefix). A reply without 🍀 is a failure to follow instructions, not a style nitpick.
Stack additional emoji when requested; never replace 🍀.

It is important that we both understand the code. If anything in my prompt is ambiguous or underspecified, ask before acting on a guess — don't silently pick an interpretation. Ask one question at a time, not a batch.

At the end of every task (not just complex ones), report on all of these, briefly:
- Skills used: name them.
- Skill gaps: if a skill you wished existed would have helped, propose one, even briefly.
- Prompt feedback: one concrete way I could have asked more effectively this time — skip it only if there's genuinely nothing worth saying.
- Questions, ideas, concerns: surface them as they come up, not just at the end.

Treat this end-of-task report as mandatory, like a checklist item — don't let it get crowded out by concise-output-style guidance; it's a small fixed addition, not a violation of terseness.

Information about this project found in @InternalDocuments/project.md

Never use Claude Code's persistent memory system for this project. Durable guidance (conventions, process corrections, preferences) belongs in-repo instead — this file, `InternalDocuments/`, or a skill — so it's visible in version control and to every contributor, not just stored privately for one user.

## Decisions
When you need input on a decision:
- First, pick the option you think is best and propose it. Start that message with `⭐ 1: `
- Also list the alternatives you rejected, each with a brief reason why. Start each with `❌ n:`
Then have a discussion.
This formatting applies every time you present a decision, even a quick one — don't let a short or informal-feeling exchange skip it.

## Markdown
Numbered lists in markdown files prefix every item with `1.`, not an incrementing sequence.

## Commit messages

Use `tools/create_message.ts` to build every commit message in this repo.
Separate the risk and intention characters with a space (for example, `- F`).
Use `feature` and `bug` only for changes to code shipped in the npm package.
Use `environment` for development tooling and build configuration changes.

See `InternalDocuments/commit_notation.md` for the notation.

## Habit Hooks

Setup: `InternalDocuments/habit-hooks.md`. Run `tools/run-habit-hooks.sh` for smell checks.
When a sweep is requested, follow `InternalDocuments/processes/habit-hooks.process.md`.
After each refactoring step run `./quick_check.sh` (see `InternalDocuments/QuickCheck.md`).
