import fs from "fs";
import os from "os";
import path from "path";

import sinon from "sinon";

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
      missing = error.message.split(directory + path.sep).join("<dir>/");
    }

    verify(
      `text file: ${reporter.canReportOn(text)}\nmissing file: ${missing}`,
    );
  });

  describe("report", function () {
    let output: string[];
    let sandbox: sinon.SinonSandbox;

    beforeEach(function () {
      output = [];
      sandbox = sinon.createSandbox();
      sandbox.stub(console, "log").callsFake((...args) => {
        output.push(`${args.join(" ")}\n`);
      });
      sandbox.stub(process.stdout, "write").callsFake((text: any) => {
        output.push(String(text));
        return true;
      });
    });

    afterEach(function () {
      sandbox.restore();
    });

    function capturedOutput(): string {
      return output
        .join("")
        .split(directory + path.sep)
        .join("<dir>/")
        .split("\u001b[32m")
        .join("[green]")
        .split("\u001b[31m")
        .join("[red]")
        .split("\u001b[90m")
        .join("[gray]")
        .replace(/\u001b\[39m/g, "[/]");
    }

    it("shows added, removed and unchanged parts", function () {
      const approved = path.join(directory, "c.approved.txt");
      const received = path.join(directory, "c.received.txt");
      fs.writeFileSync(approved, "hello world");
      fs.writeFileSync(received, "hello there");

      new NodeDiffReporter().report(approved, received, {});

      const text = capturedOutput();
      sandbox.restore();
      verify(text);
    });

    it("creates the approved file when it does not exist", function () {
      const approved = path.join(directory, "d.approved.txt");
      const received = path.join(directory, "d.received.txt");
      fs.writeFileSync(received, "new text");

      new NodeDiffReporter().report(approved, received, {});

      const text = capturedOutput();
      sandbox.restore();
      verify(`${text}\napproved file created: ${fs.existsSync(approved)}`);
    });
  });
});
