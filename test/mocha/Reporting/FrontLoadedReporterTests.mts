import fs from "fs";
import os from "os";
import path from "path";

import { getConfig, verifyWithControl } from "../../../lib/Approvals.js";
import { Reporter } from "../../../lib/Core/Reporter.js";
import { ManualNamer } from "../../../lib/ManualNamer.js";
import {
  setNamer,
  verify,
} from "../../../lib/Providers/Mocha/MochaApprovals.js";
import {
  DefaultFrontLoadedReporter,
  withFrontLoadedReporter,
} from "../../../lib/Reporting/FrontLoadedReporter.js";
import { StringWriter } from "../../../lib/StringWriter.js";

function fakeReporter(name: string): Reporter {
  return { name, canReportOn: () => true, report: () => {} };
}

function names(reporters: Reporter[]): string {
  return reporters.map((reporter) => reporter.name).join(", ");
}

describe("FrontLoadedReporter", function () {
  beforeEach(function () {
    setNamer(this);
  });

  it("puts the front loaded reporter before the normal reporters", function () {
    const normal = [fakeReporter("normal")];
    const lines = [
      `default: ${names(withFrontLoadedReporter({}, normal))}`,
      `null: ${names(withFrontLoadedReporter({ frontLoadedReporter: null }, normal))}`,
      `custom: ${names(withFrontLoadedReporter({ frontLoadedReporter: fakeReporter("custom") }, normal))}`,
      `default reporter: ${new DefaultFrontLoadedReporter().name}`,
    ];
    verify(lines.join("\n"));
  });

  it("replaces an explicitly configured reporter when it applies", function () {
    const used: string[] = [];
    const record = (name: string): Reporter => ({
      name,
      canReportOn: () => true,
      report: () => {
        used.push(name);
      },
    });

    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "front loaded "));
    try {
      verifyWithControl(
        new ManualNamer(directory, "never_approved"),
        new StringWriter(getConfig(), "text that is never approved"),
        null,
        {
          frontLoadedReporter: record("front loaded"),
          reporters: [record("explicit")],
        },
      );
    } catch {
      // the verify fails on purpose
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }

    verify(`used: ${used.join(", ")}`);
  });
});
