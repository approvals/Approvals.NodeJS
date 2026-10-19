const {
  verify,
} = require("@approval-tests/approvals/lib/Providers/Jest/JestApprovals");

test("verifies with only Jest installed", () => {
  verify("Hello from Jest");
});
