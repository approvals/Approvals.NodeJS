import { ReporterFactory } from "../../lib/Reporting/ReporterFactory.js";
import DiffReporterAggregate from "../../lib/Reporting/DiffReporterAggregate.js";
import { testDirectory } from "../testPaths.mjs";

import assert from "assert";
import path from "path";

describe("AggregateReporter", function () {
  const textDiffReporters = ["gitdiff", "p4merge"];

  it("should be able to report on a txt file", function () {
    this.timeout(60000); // just a test to see if it can pass on AppVeyor?
    const file = path.join(testDirectory, "Reporting", "a.txt");
    const reporters = ReporterFactory.loadAllReporters(textDiffReporters);
    const reporterX = new DiffReporterAggregate(reporters);
    const canReportOn = reporterX.canReportOn(file);
    assert.ok(canReportOn, "Can report on " + file);

    const foundReporter = reporterX.getReporter(file);

    assert.ok(foundReporter, "foundReporter not found?");
  });
});
