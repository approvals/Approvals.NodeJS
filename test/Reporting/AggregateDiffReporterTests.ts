import { ReporterFactory } from "../../lib/Reporting/ReporterFactory";

import assert from "assert";

import path from "path";

import DiffReporterAggregate from "../../lib/Reporting/DiffReporterAggregate";
import {testDirectory} from "../testPaths";

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
