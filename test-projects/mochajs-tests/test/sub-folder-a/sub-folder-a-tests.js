describe("nested-folder-tests", function () {
  require("@approval-tests/approvals")
    .configure({ reporters: ["donothing"] })
    .mocha();
  it("sub-folder-a", function () {
    this.verify("sub-folder-a");
  });
});
