'use strict';

var ReporterFactory = require("../../lib/Reporting/ReporterFactory.js");
var os = require("../../lib/osTools");
var assert = require("assert");
var path = require("path");
var fs = require("fs");
var expect = require('chai').expect;

describe('ReporterFactory', function () {

  var textDiffReporters, allAvailableDiffReporters;

  if (os.platform.isWindows) {
    textDiffReporters = ['DoNothing', 'gitdiff'];
    allAvailableDiffReporters = ['DoNothing', 'gitdiff'];
  } else {
    textDiffReporters = ['DoNothing', 'gitdiff'];
    allAvailableDiffReporters = ['DoNothing', 'gitdiff'];
  }

  it('Should load specific reporters', function () {
    allAvailableDiffReporters.forEach(function (differ) {
      ReporterFactory.ReporterFactory.loadReporter(differ);
    });
  });

  it('Should report all available if incorrect name specified', function () {
    try {
      ReporterFactory.ReporterFactory.loadReporter('wat?');
    } catch (e) {
      if (e.message.indexOf("Error loading reporter or reporter not found [wat?]. Try one of the following") === -1) {
        throw e;
      }
    }
  });

  it('Should load all reporters', function () {
    var reporters = ReporterFactory.ReporterFactory.loadAllReporters(allAvailableDiffReporters);
    assert.strictEqual(reporters.length, allAvailableDiffReporters.length);
  });

  it("should be able to report on a txt file", function () {

    var reporters = ReporterFactory.ReporterFactory.loadAllReporters(textDiffReporters);

    reporters.forEach(function (reporter) {

      assert.ok(reporter.canReportOn, "Reporter missing 'canReportOn' function for reporter [" + reporter.name + "]");

      var canReportOn = reporter.canReportOn(path.join(__dirname, "a.txt"));
      assert.ok(canReportOn, "Could not load reporter with name [" + reporter.name + "]");
    });

  });

  describe("When loading an array of reporters", function () {
    it("should use the ReporterDiffAggregate", function () {
      ReporterFactory.ReporterFactory.loadReporter(textDiffReporters);
    });
  });

  describe('assertValidReporter a valid reporter', function (){
    var validDummyReporter;

    beforeEach(function () {
      validDummyReporter = {
        name: "validDummyReporter",
        canReportOn: function () { return true; },
        report: function () { }
      };
    });

    it("should return true for a valid reporter", function () {
      expect(ReporterFactory.ReporterFactory.assertValidReporter(validDummyReporter)).to.equal(true);
    });

    it("should raise an error when reporter is missing a name", function () {
      expect(function () {
        delete validDummyReporter.name;
        ReporterFactory.ReporterFactory.assertValidReporter(validDummyReporter);
      }).to.throw(Error, /A valid reporter should have a/);
    });

    it("should raise an error when reporter is missing a canReportOn", function () {
      expect(function () {
        delete validDummyReporter.canReportOn;
        ReporterFactory.ReporterFactory.assertValidReporter(validDummyReporter);
      }).to.throw(Error, /A valid reporter should have a/);
    });

    it("should raise an error when reporter is missing a report", function () {
      expect(function () {
        delete validDummyReporter.report;
        ReporterFactory.ReporterFactory.assertValidReporter(validDummyReporter);
      }).to.throw(Error, /A valid reporter should have a/);
    });

  });


  describe("When loading every reporter:", function () {
    var allReporters;
    before(function () {
      this.timeout(20000); //appveyor seems slow
      allReporters = fs.readdirSync(path.join(__dirname, '../../lib/Reporting/Reporters'))
        .map(function (item) {
          return item.substr(0, item.indexOf('Reporter.js'));
        })
        .filter(function (reporterName) {
          return reporterName !== 'visualstudio'; // this has issues running in C.I. environment due to edge
        })
        .map(function (reporterName) {
          console.log("reporter", reporterName);
          return {
            name: reporterName,
            reporter: ReporterFactory.ReporterFactory.loadReporter(reporterName)
          };
        });
    });
    it("Should load all the reporters on disk, verify they follow the basic contract etc...", function () {

      allReporters.forEach(item => {
        var reporter = item.reporter;
        try {
          ReporterFactory.ReporterFactory.assertValidReporter(reporter);
        } catch (err) {
          console.error(err);
          throw new Error("Reporter " + item.name + " did not conform to Reporter interface \n" + err);
        }
      });


    });

  });

});
