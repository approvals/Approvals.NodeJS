require("../../../../").mocha();

describe("nested-folder-tests", function () {
  it("sub-folder-a", function () {
    this.verify("sub-folder-a");
  });
});
