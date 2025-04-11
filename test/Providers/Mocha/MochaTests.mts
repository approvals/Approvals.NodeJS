
import { verify, setNamer } from "../../../lib/Providers/Mocha/MochaApprovals.js";

describe("Mocha", function () {
  describe("when verifying some basic text", function () {
    beforeEach(function () {
      setNamer(this);
    });

    it("should work", function () {
      verify("Hello World!");
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
