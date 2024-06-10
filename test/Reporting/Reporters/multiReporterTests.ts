var approvals = require("../../../lib/Approvals");
var expect = require("chai").expect;

describe("multiReporter", function () {
  it("should use a multiple reporter", function () {
    var MultiReporter = approvals.reporters.MultiReporter;
    var MyCustomReporter = function () {
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
        name: "temp-test-reporter",
      };
    };

    var r1 = new MyCustomReporter();
    var r2 = new MyCustomReporter();

    var multiReporter = new MultiReporter([r1, r2]);

    multiReporter.report("asdf", "bsdf");

    expect(r1.getWasReporterUsed()).to.equal(true);
    expect(r2.getWasReporterUsed()).to.equal(true);
  });

  it("It should error propertly", function () {
    var MultiReporter = approvals.reporters.MultiReporter;
    var MyCustomReporter = function (name) {
      var wasReporterUsed = false;
      return {
        canReportOn: function (/*file*/) {
          return true;
        },
        report: function (/*approved, received*/) {
          throw new Error(
            "This is an error message for reporter: " + this.name,
          );
        },
        getWasReporterUsed: function () {
          return wasReporterUsed;
        },
        name: "temp-test-reporter - " + name,
      };
    };

    var r1 = new MyCustomReporter("reporter 1");
    var r2 = new MyCustomReporter("reporter 2");

    var multiReporter = new MultiReporter([r1, r2]);

    try {
      multiReporter.report("asdf", "bsdf");
    } catch (error) {
      approvals.verify(
        __dirname,
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
