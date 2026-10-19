describe("nested-folder-tests", function () {
  require("@approval-tests/approvals")
    .configure({ reporters: ["donothing"] })
    .mocha();
  it("root-folder", function () {
    this.verify("root-folder");
  });
});
