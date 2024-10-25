import {testDirectory} from "../../testPaths.js";
import ReporterUnderTest from "../../../lib/Reporting/Reporters/opendiffReporter.js";
import path from "path";
import assert from "assert";
import {findProgramOnPath} from "../../../lib/AUtils.js";

describe("Reporter", function () {
  if (findProgramOnPath("opendiff")) {
    describe("opendiff", function () {
      xit("reporter args are correct", function () {
        const reporter = new ReporterUnderTest.default();

        const approvedFile = path.join(testDirectory, "Reporting", "Reporters", "a.txt");
        const receivedFile = path.join(testDirectory, "Reporting", "Reporters", "b.txt");

        const expectedCommand = [receivedFile, approvedFile];

        const args = reporter.getCommandArguments(approvedFile, receivedFile);
        assert.deepEqual(expectedCommand, args.args);
        assert.ok(args.cmdOptions.toLowerCase().indexOf("opendiff") >= 0);
      });
    });
  }
});
