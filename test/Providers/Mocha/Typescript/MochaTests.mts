import assert from "assert";
import { verify } from "../../../../lib/Approvals.js";

describe("Mocha Typescript Approvals", () => {
  it("verify", function() {
    this.verify("Hello From Approvals");
    assert.equal(2, 2);
  });

  //  it2("verify approvals", () => {
  //      verify("Hello From Approvals");
  //      // get the test name of the current mocha test
  // });
});
