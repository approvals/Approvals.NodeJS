import fs from "fs";
import path from "path";

import { Reporter } from "../../Core/Reporter";

const FALSE_VALUES = ["0", "f", "F", "false", "FALSE", "False"];

export default class AiCodingAgentReporter implements Reporter {
  static ENVIRONMENT_VARIABLES: string[] = [
    "AI_AGENT",
    "APPROVAL_TESTS_AGENT",
    "CLAUDECODE",
    "CLAUDE_CODE_ENTRYPOINT",
    "CODEX_SANDBOX",
    "CURSOR_AGENT",
    "CURSOR_TRACE_ID",
    "GEMINI_CLI",
    "OPENCODE",
  ];

  public name: string = "AiCodingAgent";
  private environment: Record<string, string | undefined>;

  constructor(environment: Record<string, string | undefined> = process.env) {
    this.environment = environment;
  }

  canReportOn(): boolean {
    return AiCodingAgentReporter.ENVIRONMENT_VARIABLES.some((variable) =>
      isSet(this.environment[variable]),
    );
  }

  report(approved: string, received: string): void {
    console.log(AiCodingAgentReporter.getReportText(approved, received));
  }

  static getReportText(approved: string, received: string): string {
    const approvedPath = path.resolve(approved);
    const receivedPath = path.resolve(received);
    return [
      "# APPROVAL TEST FAILED",
      `  approved: ${approvedPath}`,
      `  received: ${receivedPath}`,
      `  approve_with: mv -f "${receivedPath}" "${approvedPath}"`,
      "",
      "## APPROVED",
      "```",
      readContents(approvedPath, "APPROVED"),
      "```",
      "",
      "## RECEIVED",
      "```",
      readContents(receivedPath, "RECEIVED"),
      "```",
      "----------------------------------------",
    ].join("\n");
  }
}

function isSet(value: string | undefined): boolean {
  if (value === undefined || value.trim() === "") {
    return false;
  }
  return !FALSE_VALUES.includes(value.trim());
}

function readContents(file: string, label: string): string {
  try {
    return fs.readFileSync(file).toString();
  } catch {
    return `** Error reading ${label} file **`;
  }
}
