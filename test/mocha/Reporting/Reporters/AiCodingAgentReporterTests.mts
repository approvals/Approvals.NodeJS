import fs from "fs";
import os from "os";
import path from "path";

import {
  setNamer,
  verify,
} from "../../../../lib/Providers/Mocha/MochaApprovals.js";
import AiCodingAgentReporterModule from "../../../../lib/Reporting/Reporters/aicodingagentReporter.js";

const AiCodingAgentReporter = AiCodingAgentReporterModule.default;

describe("AiCodingAgentReporter", function () {
  let directory: string;

  beforeEach(function () {
    setNamer(this);
    directory = fs.mkdtempSync(path.join(os.tmpdir(), "ai agent reporter "));
  });

  afterEach(function () {
    fs.rmSync(directory, { recursive: true, force: true });
  });

  it("detects agents from environment variables", function () {
    const values = [undefined, "", "  ", "0", "f", "F", "false", "FALSE"];
    const moreValues = ["False", "1", "true", "cli", "claude-code"];
    const lines = [...values, ...moreValues].map((value) => {
      const env = value === undefined ? {} : { CLAUDECODE: value };
      const detected = AiCodingAgentReporter.isAgentDetected(env);
      return `${JSON.stringify(value)} => ${detected}`;
    });
    verify(lines.join("\n"));
  });

  it("detects every listed agent variable", function () {
    const lines = AiCodingAgentReporter.ENVIRONMENT_VARIABLES.map(
      (variable) =>
        `${variable} => ${AiCodingAgentReporter.isAgentDetected({ [variable]: "1" })}`,
    );
    verify(lines.join("\n"));
  });

  it("prints both files and the approve command", function () {
    const approved = path.join(directory, "a.approved.txt");
    const received = path.join(directory, "a.received.txt");
    fs.writeFileSync(approved, "hello world");
    fs.writeFileSync(received, "hello there");

    const text = AiCodingAgentReporter.getReportText(approved, received);
    verify(text.split(directory).join("<dir>"));
  });

  it("reports when the approved file is missing", function () {
    const approved = path.join(directory, "b.approved.txt");
    const received = path.join(directory, "b.received.txt");
    fs.writeFileSync(received, "new text");

    const text = AiCodingAgentReporter.getReportText(approved, received);
    verify(text.split(directory).join("<dir>"));
  });
});
