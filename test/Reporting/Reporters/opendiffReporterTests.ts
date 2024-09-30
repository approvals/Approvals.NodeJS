import {testDirectory} from "../../testPaths";
import ReporterUnderTest from "../../../lib/Reporting/Reporters/opendiffReporter";
import path from "path";
import assert from "assert";
import {findProgramOnPath} from "../../../lib/AUtils";

describe("Reporter", function () {
  if (findProgramOnPath("opendiff")) {
    describe("opendiff", function () {
      xit("reporter args are correct", function () {
        const reporter = new ReporterUnderTest();

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
