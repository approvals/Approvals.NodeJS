import { expect } from "chai";

import fs from "fs";
import path from "path";
import assert from "assert";
import * as os from "../../lib/osTools.js";
import { ReporterFactory } from "../../lib/Reporting/ReporterFactory.js";
import {testDirectory} from "../testPaths.mjs";

describe("ReporterFactory", function () {
  let textDiffReporters, allAvailableDiffReporters;

  if (os.platform.isWindows) {
    textDiffReporters = ["DoNothing", "gitdiff"];
    allAvailableDiffReporters = ["DoNothing", "gitdiff"];
  } else {
    textDiffReporters = ["DoNothing", "gitdiff"];
    allAvailableDiffReporters = ["DoNothing", "gitdiff"];
  }

  it("Should load specific reporters", function () {
    allAvailableDiffReporters.forEach(function (differ) {
      ReporterFactory.loadReporter(differ);
    });
  });

  it("Should report all available if incorrect name specified", function () {
    try {
      ReporterFactory.loadReporter("wat?");
    } catch (e: any) {
      if (
        e.message.indexOf(
          "Error loading reporter or reporter not found [wat?]. Try one of the following",
        ) === -1
      ) {
        throw e;
      }
    }
  });

  it("Should load all reporters", function () {
    const reporters = ReporterFactory.loadAllReporters(
      allAvailableDiffReporters,
    );
    assert.strictEqual(reporters.length, allAvailableDiffReporters.length);
  });

  it("should be able to report on a txt file", function () {
    const reporters = ReporterFactory.loadAllReporters(textDiffReporters);

    reporters.forEach(function (reporter) {
      assert.ok(
        reporter.canReportOn,
        "Reporter missing 'canReportOn' function for reporter [" +
          reporter.name +
          "]",
      );

      const canReportOn = reporter.canReportOn(path.join(testDirectory, "Reporting", "a.txt"));
      assert.ok(
        canReportOn,
        "Could not load reporter with name [" + reporter.name + "]",
      );
    });
  });

  describe("When loading an array of reporters", function () {
    it("should use the ReporterDiffAggregate", function () {
      ReporterFactory.loadReporter(textDiffReporters);
    });
  });

  describe("assertValidReporter a valid reporter", function () {
    let validDummyReporter;

    beforeEach(function () {
      validDummyReporter = {
        name: "validDummyReporter",
        canReportOn: function () {
          return true;
        },
        report: function () {},
      };
    });

    it("should return true for a valid reporter", function () {
      expect(ReporterFactory.assertValidReporter(validDummyReporter)).to.equal(
        true,
      );
    });

    it("should raise an error when reporter is missing a name", function () {
      expect(function () {
        delete validDummyReporter.name;
        ReporterFactory.assertValidReporter(validDummyReporter);
      }).to.throw(Error, /A valid reporter should have a/);
    });

    it("should raise an error when reporter is missing a canReportOn", function () {
      expect(function () {
        delete validDummyReporter.canReportOn;
        ReporterFactory.assertValidReporter(validDummyReporter);
      }).to.throw(Error, /A valid reporter should have a/);
    });

    it("should raise an error when reporter is missing a report", function () {
      expect(function () {
        delete validDummyReporter.report;
        ReporterFactory.assertValidReporter(validDummyReporter);
      }).to.throw(Error, /A valid reporter should have a/);
    });
  });

  describe("When loading every reporter:", function () {
    let allReporters;
    before(function () {
      this.timeout(20000); //appveyor seems slow
      allReporters = fs
        .readdirSync(path.join(testDirectory, "../lib/Reporting/Reporters"))
        .map(function (item) {
          if (item.indexOf("Reporter.d.ts") === -1) {
            // ignore the typescript definition file
          }
          if (item.indexOf("Reporter.ts") !== -1) {
            return item.substr(0, item.indexOf("Reporter.ts"));
          } else if (item.indexOf("Reporter.js") !== -1) {
            return item.substr(0, item.indexOf("Reporter.js"));
          }
          return "";
        })
        .filter(function (reporterName) {
          return reporterName !== "visualstudio"; // this has issues running in C.I. environment due to edge
        })
        .filter(function (reporterName) {
          return !!reporterName;
        })
        .map(function (reporterName: string) {
          console.log("reporter", reporterName);
          return {
            name: reporterName,
            reporter: ReporterFactory.loadReporter(reporterName),
          };
        });
    });
    it("Should load all the reporters on disk, verify they follow the basic contract etc...", function () {
      allReporters.forEach((item) => {
        const reporter = item.reporter;
        try {
          ReporterFactory.assertValidReporter(reporter);
        } catch (err) {
          console.error(err);
          throw new Error(
            "Reporter " +
              item.name +
              " did not conform to Reporter interface \n" +
              err,
          );
        }
      });
    });
  });
});
