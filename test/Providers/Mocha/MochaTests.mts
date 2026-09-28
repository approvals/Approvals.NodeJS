import assert from "assert";
import path from "path";
import {
  verify,
  setNamer,
  getNamer,
} from "../../../lib/Providers/Mocha/MochaApprovals.js";

describe("Mocha", function () {
  describe("when verifying some basic text", function () {
    beforeEach(function () {
      setNamer(this);
    });

    it("should work", function () {
      verify("Hello World!");
    });

    it("should use expected separators", function () {
      assert.strictEqual(
        path.basename(getNamer().getApprovedFile("txt")),
        "MochaTests.Mocha.when_verifying_some_basic_text.should_use_expected_separators.approved.txt",
      );
    });

    it("should verifyAsJSON", function () {
      var value = {
        a: 1,
        b: "bar",
      };

      this.verifyAsJSON(value);
    });
  });
});
