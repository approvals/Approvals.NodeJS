import path from "path";

import { describe, expect, test } from "vitest";

import {
  verify,
  verifyAll,
  verifyAsJson,
} from "../../lib/Providers/Vitest/VitestApprovals.js";
import { getVitestNamer } from "../../lib/Providers/Vitest/VitestNamer.js";

describe("VitestApprovals", () => {
  test("verify", () => {
    verify("Hello From Approvals.");
  });

  test("verifyAsJson", () => {
    verifyAsJson({ name: "fred", age: 30 });
  });

  test("verifyAll", () => {
    verifyAll("Squared", [1, 2, 3], (n) => `${n} => ${n * n}`);
  });

  it("should use single separator", () => {
    expect(path.basename(getVitestNamer().getApprovedFile("txt"))).toBe(
      "Vitest.test.VitestApprovals_should_use_single_separator.approved.txt",
    );
  });
});
