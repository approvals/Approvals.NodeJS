import * as approvals from "../../../lib/Approvals";
import {defaultConfig} from "../../../lib/config";

describe("Mocha", function () {
  describe("when verifying some basic text", function () {
    beforeEach(function () {
      approvals
        .configure(Object.assign({}, defaultConfig, {
            appendEOL: false,
            normalizeLineEndingsTo: "\n",
            reporters: ["nodediff"],
        }))
        .mocha();
    });

    it("should work", function () {
      this.verify("Hello World!");
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
