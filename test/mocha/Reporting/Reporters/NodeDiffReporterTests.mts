import fs from "fs";
import os from "os";
import path from "path";

import {
  setNamer,
  verify,
} from "../../../../lib/Providers/Mocha/MochaApprovals.js";
import NodeDiffReporterModule from "../../../../lib/Reporting/Reporters/nodediffReporter.js";

const NodeDiffReporter = NodeDiffReporterModule.default;

describe("NodeDiffReporter", function () {
  let directory: string;

  beforeEach(function () {
    setNamer(this);
    directory = fs.mkdtempSync(path.join(os.tmpdir(), "nodediff reporter "));
  });

  afterEach(function () {
    fs.rmSync(directory, { recursive: true, force: true });
  });

  it("can report on text files and not on missing files", function () {
    const text = path.join(directory, "c.received.txt");
    fs.writeFileSync(text, "text");
    const reporter = new NodeDiffReporter();

    let missing: string;
    try {
      reporter.canReportOn(path.join(directory, "missing.txt"));
      missing = "no error";
    } catch (error: any) {
      missing = error.message.split(directory).join("<dir>");
    }

    verify(`text file: ${reporter.canReportOn(text)}\nmissing file: ${missing}`);
  });
});
