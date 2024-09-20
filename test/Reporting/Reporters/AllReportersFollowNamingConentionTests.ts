import fs from "fs";
import assert from "assert";
import {testDirectory} from "../../testPaths";

const allReporterFiles: string[] = [];
describe("All reporters must conform to naming convention", function () {
  beforeEach(function () {
    fs.readdirSync(testDirectory + "/../lib/Reporting/Reporters").forEach(
      function (file) {
        if (file.indexOf("Reporter.js") > -1) {
          allReporterFiles.push(file);
        } else if (file.indexOf("Reporter.ts") > -1) {
          allReporterFiles.push(file);
        }
      },
    );
  });

  it("should have some reporters", function () {
    assert.ok(allReporterFiles.length, "should have found some file");
  });

  it("should all have prefix names lower case", function () {
    allReporterFiles.forEach(function (item) {
      const prefix = item
        .replace("Reporter.js", "")
        .replace("Reporter.ts", "")
        .replace("Reporter.d.ts", "");
      assert.strictEqual(prefix, prefix.toLowerCase());
    });
  });
});
