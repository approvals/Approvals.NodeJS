describe("nested-folder-tests", function () {
  require("@approval-tests/approvals")
    .configure({ reporters: ["donothing"] })
    .mocha();
  it("sub-folder-b", function () {
    this.verify("sub-folder-b");
  });
});
