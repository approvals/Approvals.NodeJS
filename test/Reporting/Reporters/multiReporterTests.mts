import { Reporter } from "../../../lib/Core/Reporter.js";

import {expect} from "chai";
import * as path from "path";
import * as approvals from "../../../lib/Approvals.js";
import {testDirectory} from "../../testPaths.js";

class ExceptionThrowingReporter implements Reporter {
  public name: string;

  constructor(name: string) {
    this.name = "temp-test-reporter - " + name;
  }

  canReportOn(/*file*/) {
    return true;
  }

  report(/*approved, received*/) {
    throw new Error("This is an error message for reporter: " + this.name);
  }
}

class TrackingReporter implements Reporter {
  private wasReporterUsed = false;
  public name: string = "temp-test-reporter";

  canReportOn(/*file*/) {
    return true;
  }

  report(/*approved, received*/) {
    this.wasReporterUsed = true;
  }

  getWasReporterUsed() {
    return this.wasReporterUsed;
  }
}

describe("multiReporter", function () {
  it("should use a multiple reporter", function () {
    var MultiReporter = approvals.reporters.MultiReporter;

    var r1 = new TrackingReporter();
    var r2 = new TrackingReporter();

    var multiReporter = new MultiReporter([r1, r2]);

    multiReporter.report("asdf", "bsdf");

    expect(r1.getWasReporterUsed()).to.equal(true);
    expect(r2.getWasReporterUsed()).to.equal(true);
  });

  it("It should error propertly", function () {
    var MultiReporter = approvals.reporters.MultiReporter;

    var r1 = new ExceptionThrowingReporter("reporter 1");
    var r2 = new ExceptionThrowingReporter("reporter 2");

    var multiReporter = new MultiReporter([r1, r2]);

    try {
      multiReporter.report("asdf", "bsdf");
    } catch (error: any) {
      approvals.verify(
        path.join(testDirectory, "Reporting", "Reporters"),
        "It_should_error_properly",
        error.toString(),
        {
          appendEOL: true,
          failOnLineEndingDifferences: false,
        },
      );
    }
  });
});
