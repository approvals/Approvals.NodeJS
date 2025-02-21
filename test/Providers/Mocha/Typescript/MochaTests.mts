import assert from "assert";
import {
    verify,
    setNamer,
} from "../../../../lib/Providers/Mocha/MochaApprovals.js";
describe("Mocha Typescript Approvals", () => {
    beforeEach(function () {
        setNamer(this);
    });
  it("verify from function", function () {
  verify("Hello From Approvals");
    assert.equal(2, 2);
  });

  it("verify from lambda", () => {
    verify("Hello From Approvals2");
  });

  //  it2("verify approvals", () => {
  //      verify("Hello From Approvals");
  //      // get the test name of the current mocha test
  // });
});
