#!/usr/bin/env node
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

const INTENTIONS_ALLOWING_ANY_RISK = new Set<string>([
  "refactor",
  "feature",
  "bug",
]);

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
  if (
    !INTENTIONS_ALLOWING_ANY_RISK.has(intention) &&
    risk !== "completely_safe"
  ) {
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
