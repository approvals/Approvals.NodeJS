"use strict";

import {testDirectory} from "../../testPaths";

var expect = require("chai").expect;
var path = require("path");
var ReporterUnderTest =
  require("../../../lib/Reporting/Reporters/vimdiffReporter").default;

describe("Reporter", function () {
  describe("vimdiff", function () {
    it("reporter args are correct", function () {
      var reporter = new ReporterUnderTest();

      var approved = path.join(testDirectory, "Reporting", "Reporters", "a.txt");
      var received = path.join(testDirectory, "Reporting", "Reporters", "b.txt");

      reporter.spawn = (exe, args) => {
        expect(args).to.deep.equal(["-d", received, approved]);

        return {
          status: 0, // success
        };
      };

      reporter.report(approved, received);
    });
  });
});
