//require('approvals').mocha();

import { it2, verify } from "../../../../lib/Providers/Mocha/MochaApprovals";

import assert from "assert";
// import { describe, it } from 'mocha';

describe("Mocha Typescript Approvals", () => {
  it("verify", () => {
    // verify("Hello From Approvals");
    assert.equal(2, 2);
  });

  //  it2("verify approvals", () => {
  //      verify("Hello From Approvals");
  //      // get the test name of the current mocha test
  // });
});
