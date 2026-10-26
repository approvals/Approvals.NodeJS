#!/usr/bin/env node
/**
 * Create a commit message: <risk char> <intention char> <message>
 *
 * Usage: node tools/create_message.ts RISK INTENTION MESSAGE
 * Risk and intention are separated by a space, for example: - F Add a feature
 * Use feature and bug only for code shipped in the npm package.
 * Use environment for development tooling and build configuration changes.
 */

const RISKS = {
  completely_safe: ".",
  proven: "-",
  single_item: "!",
  other: "@",
} as const;

const INTENTIONS = {
  environment: "e",
  test: "t",
  refactor: "r",
  feature: "F",
  bug: "B",
  documentation: "d",
} as const;

// Only these intentions may carry a risk other than completely_safe.
const CODE_INTENTIONS = new Set<string>(["refactor", "feature", "bug"]);

function create_message(
  risk: string,
  intention: string,
  message: string,
): string {
  if (!Object.prototype.hasOwnProperty.call(RISKS, risk)) {
    throw new Error(
      `unrecognized risk '${risk}' (expected one of: ${Object.keys(RISKS).join(", ")})`,
    );
  }
  if (!Object.prototype.hasOwnProperty.call(INTENTIONS, intention)) {
    throw new Error(
      `unrecognized intention '${intention}' (expected one of: ${Object.keys(INTENTIONS).join(", ")})`,
    );
  }
  if (!CODE_INTENTIONS.has(intention) && risk !== "completely_safe") {
    throw new Error(
      `intention '${intention}' is not a code change, so risk must be completely_safe`,
    );
  }
  if (!message || !message.trim()) {
    throw new Error("message is required");
  }
  return `${RISKS[risk as keyof typeof RISKS]} ${INTENTIONS[intention as keyof typeof INTENTIONS]} ${message.trim()}`;
}

function main(argv: string[]): number {
  if (argv.length !== 3) {
    console.error("usage: node tools/create_message.ts risk intention message");
    return 2;
  }
  try {
    console.log(create_message(argv[0], argv[1], argv[2]));
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }
    console.error(`error: ${error.message}`);
    return 1;
  }
  return 0;
}

process.exitCode = main(process.argv.slice(2));
