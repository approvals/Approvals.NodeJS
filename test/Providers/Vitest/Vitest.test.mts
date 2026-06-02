import { describe, test } from "vitest";
import { verify } from "../../../lib/Providers/Vitest/VitestApprovals.js";

describe("VitestApprovals", () => {
  test("verify", () => {
    verify("Hello From Approvals.");
  });
});
