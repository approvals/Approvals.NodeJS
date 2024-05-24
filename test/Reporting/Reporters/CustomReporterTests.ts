import {expect} from "chai";

import assert from "assert";
import {Reporter} from "../../../lib/Core/Reporter";
var approvals = require("../../../lib/Approvals").mocha();


interface CustomReporter extends Reporter {
    getWasReporterUsed: () => boolean;
}
function MyCustomReporter(): CustomReporter {
    var wasReporterUsed = false;
    return {
        canReportOn: function (/*file*/) {
            return true;
        },
        report: function (/*approved, received*/) {
            wasReporterUsed = true;
        },
        getWasReporterUsed: function () {
            return wasReporterUsed;
        },
        name: "globalCustomReporter",
    };
}


let globalCustomReporter: CustomReporter

describe("CustomReporter", function () {
  beforeEach(function () {
    globalCustomReporter = MyCustomReporter();
  });

  it("allows CustomReporter at method level", function () {
    let calledCustomReporter = false;

    try {
      this.verify("foo", {
        errorOnStaleApprovedFiles: false,
        reporters: [
          {
            name: "my-test-custom-reporter",
            canReportOn: function (/*file*/) {
              return true;
            },
            report: function (/*approved, received*/) {
              calledCustomReporter = true;
            },
          },
        ],
      });
    } catch (err) {
      //
    }

    assert.ok(calledCustomReporter);
  });

  it("uses global custom reporter", function () {
    const config = approvals.getConfig({
      reporters: [globalCustomReporter],
    });

    try {
      this.verify("foo", config);
    } catch (err) {
      //
    }

    assert.ok(globalCustomReporter.getWasReporterUsed());
  });

  it("uses global custom reporter manual verify", function () {
    const config = approvals.getConfig({
      reporters: [globalCustomReporter],
    });

    var didRaiseException = false;
    try {
      approvals.verify(
        __dirname,
        "CustomReporter.uses_global_custom_reporter_manual_verify",
        "foo",
        config,
      );
    } catch (err) {
      didRaiseException = true;
    }

    expect(didRaiseException).to.equal(true);

    assert.ok(globalCustomReporter.getWasReporterUsed());
  });

  it("uses global custom reporter 2", function () {
    approvals.configure({
      reporters: [globalCustomReporter],
      errorOnStaleApprovedFiles: false,
    });

    const reporter = this.approvals.getCurrentReporters()[0];

    assert.strictEqual(reporter.name, "globalCustomReporter");
  });
});
