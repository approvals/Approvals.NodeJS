import path from "path";
import { describe, expect, test } from "vitest";
import { verify } from "../../../lib/Providers/Vitest/VitestApprovals.js";
import { getVitestNamer } from "../../../lib/Providers/Vitest/VitestNamer.js";

describe("VitestApprovals", () => {
  test("verify", () => {
    verify("Hello From Approvals.");
  });

  it("should use single separator", () => {
    expect(path.basename(getVitestNamer().getApprovedFile("txt"))).toBe(
      "Vitest.test.VitestApprovals_should_use_single_separator.approved.txt",
    );
  });
});
