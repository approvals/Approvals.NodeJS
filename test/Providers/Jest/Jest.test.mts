import path from "path";
import { describe, expect, test } from "@jest/globals";
import {
  verify,
  verifyAll,
  verifyAsJson,
} from "../../../lib/Providers/Jest/JestApprovals.js";
import { ConfigModifier, Options } from "../../../lib/Core/Options.js";
import { convertToFilename } from "../../../lib/Core/Namer.js";
import { getJestNamer } from "../../../lib/Providers/Jest/JestNamer.js";

describe("JestApprovals", () => {
  test("verify", () => {
    verify("Hello From Approvals");
  });
  test("convertToFilename", () => {
    expect(convertToFilename("More than one space")).toBe(
      "More_than_one_space",
    );
  });

  test("uses single separator", () => {
    expect(path.basename(getJestNamer().getApprovedFile("txt"))).toBe(
      "Jest.test.JestApprovals_uses_single_separator.approved.txt",
    );
  });
  test("verify Json", () => {
    const data = { name: "fred", age: 30 };
    verifyAsJson(data);
  });
});

describe("verifyAll", () => {
  test("basics", () => {
    const digits = [1, 2, 3, 4, 5];
    verifyAll("Squared", digits, (d) => `${d} => ${d * d}`);
  });

  test("default formatter", () => {
    const digits = ["a", "b", "c"];
    verifyAll("Print", digits);
  });
});

describe("Options", () => {
  test("handles configuration", () => {
    let configModifier: ConfigModifier = (c) => {
      c.reporters = ["beyondcompare"];
      return c;
    };
    let options = new Options();
    options = options.withConfig(configModifier);
    verify("Hello from sub-directory", options);
  });
});
