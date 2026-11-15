import path from "path";

import { describe, expect, test } from "@jest/globals";

import { convertToFilename } from "../../../lib/Core/Namer.js";
import { ConfigModifier, Options } from "../../../lib/Core/Options.js";
import {
  verify,
  verifyAll,
  verifyAsJson,
} from "../../../lib/Providers/Jest/JestApprovals.js";
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

  test("verify Json", () => {
    const data = { name: "fred", age: 30 };
    verifyAsJson(data);
  });

  it("should use single separator", () => {
    expect(path.basename(getJestNamer().getApprovedFile("txt"))).toBe(
      "Jest.test.JestApprovals_should_use_single_separator.approved.txt",
    );
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
  test("uses the default scrubber when the scrubber option is null", () => {
    const options = new Options().modify("Scrubber", null);

    expect(options.scrub("hello")).toBe("hello");
  });

  test("handles configuration", () => {
    const configModifier: ConfigModifier = (c) => {
      c.reporters = ["beyondcompare"];
      return c;
    };
    let options = new Options();
    options = options.withConfig(configModifier);
    verify("Hello from sub-directory", options);
  });
});
