const {
  verify,
} = require("@approval-tests/approvals/lib/Providers/Vitest/VitestApprovals");

test("verifies with only Vitest installed", () => {
  verify("Hello from Vitest");
});
