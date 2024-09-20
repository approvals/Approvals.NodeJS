"use strict";

//icdiff test\Reporters\a.txt test\Reporters\b.txt

import {testDirectory} from "../../testPaths";

var assert = require("assert");
var path = require("path");
var ReporterUnderTest =
  require("../../../lib/Reporting/Reporters/icdiffReporter").default;

describe("Reporter", function () {
  describe("icdiff", function () {
    it("reporter args are correct", function () {
      this.timeout(20000); // failed on appVeyor for some reason?

      var reporter = new ReporterUnderTest();

      var approved = path.join(testDirectory, "Reporting", "Reporters", "a.txt");
      var received = path.join(testDirectory, "Reporting", "Reporters", "b.txt");

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
