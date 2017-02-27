require("../../../../").mocha();

describe("nested-folder-tests", function () {
  it("sub-folder-b", function () {
    this.verify("sub-folder-b");
  });
});
