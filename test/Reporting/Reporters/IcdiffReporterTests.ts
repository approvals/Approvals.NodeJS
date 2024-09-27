"use strict";

//icdiff test\Reporters\a.txt test\Reporters\b.txt

import {testDirectory} from "../../testPaths";

import ReporterUnderTest from "../../../lib/Reporting/Reporters/icdiffReporter";
import path from "path";
import assert from "assert";

describe("Reporter", function () {
  describe("icdiff", function () {
    it("reporter args are correct", function () {
      this.timeout(20000); // failed on appVeyor for some reason?

      var reporter = new ReporterUnderTest();

      var approved = path.join(testDirectory, "Reporting", "Reporters", "a.txt");
      var received = path.join(testDirectory, "Reporting", "Reporters", "r.txt");

      var expectedCommand = [received, approved];

        const args = reporter.getCommandArguments(approved, received);
        assert.deepEqual(expectedCommand, args.args);
    });
  });
});
