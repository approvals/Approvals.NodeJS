import {Reporter} from "../../../lib/Core/Reporter";

var approvals = require("../../../lib/Approvals");
var expect = require("chai").expect;

class ExceptionThrowingReporter implements Reporter {

    public name: string;

    constructor(name: string) {
        this.name = "temp-test-reporter - " + name;
    }

    canReportOn(/*file*/) {
        return true;
    }

    report(/*approved, received*/) {
        throw new Error(
            "This is an error message for reporter: " + this.name,
        );
    }
}

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

        var r1 = new ExceptionThrowingReporter("reporter 1");
        var r2 = new ExceptionThrowingReporter("reporter 2");

        var multiReporter = new MultiReporter([r1, r2]);

        try {
            multiReporter.report("asdf", "bsdf");
        } catch (error: any) {
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
