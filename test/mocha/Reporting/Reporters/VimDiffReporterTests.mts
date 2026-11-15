import assert from "assert";
import path from "path";

import ReporterUnderTest from "../../../../lib/Reporting/Reporters/vimdiffReporter.js";
import { testDirectory } from "../../testPaths.mjs";

describe("Reporter", function () {
  describe("vimdiff", function () {
    it("reporter args are correct", function () {
      const reporter = new ReporterUnderTest.default();

      const approved = path.join(
        testDirectory,
        "Reporting",
        "Reporters",
        "a.txt",
      );
      const received = path.join(
        testDirectory,
        "Reporting",
        "Reporters",
        "r.txt",
      );

      const expectedCommand = ["-d", received, approved];

      const args = reporter.getCommandArguments(approved, received);
      assert.deepEqual(expectedCommand, args.args);
      assert.deepEqual(args.cmdOptions, {
        stdio: "inherit",
      });
    });
  });
});
