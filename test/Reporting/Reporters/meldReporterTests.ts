"use strict";

//icdiff test\Reporters\a.txt test\Reporters\b.txt

var assert = require("assert");
var path = require("path");
var ReporterUnderTest = require("../../../lib/Reporting/Reporters/icdiffReporter");

describe("Reporter", function () {
  describe("icdiff", function () {
    xit("reporter args are correct", function () {
      this.timeout(20000); // failed on appVeyor for some reason?

      var reporter = new ReporterUnderTest();

      var approved = path.join(__dirname, "a.txt");
      var received = path.join(__dirname, "b.txt");

      var expectedCommand = "'icdiff' '" + received + "' '" + approved + "'";

      if (reporter.canReportOn(received)) {
        reporter.report(approved, received, {
          spawn: function (command) {
            var startTrim = command.indexOf("icdiff");
            command = "'" + command.substr(startTrim);

            assert.strictEqual(command, expectedCommand);
            return {};
          },
        });
      }
    });
  });
});
