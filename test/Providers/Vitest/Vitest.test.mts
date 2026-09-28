import path from "path";
import { describe, expect, test } from "vitest";
import { verify } from "../../../lib/Providers/Vitest/VitestApprovals.js";
import { getVitestNamer } from "../../../lib/Providers/Vitest/VitestNamer.js";

describe("VitestApprovals", () => {
  test("verify", () => {
    verify("Hello From Approvals.");
  });

  test("uses single separator", () => {
    expect(path.basename(getVitestNamer().getApprovedFile("txt"))).toBe(
      "Vitest.test.VitestApprovals_uses_single_separator.approved.txt",
    );
  });

  describe("nested suite", () => {
    test("uses single separators", () => {
      expect(path.basename(getVitestNamer().getApprovedFile("txt"))).toBe(
        "Vitest.test.VitestApprovals_nested_suite_uses_single_separators.approved.txt",
      );
    });
  });
});
