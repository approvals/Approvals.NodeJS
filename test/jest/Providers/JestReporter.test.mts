import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";

import { configure, reset } from "../../../lib/config.js";
import { ConfigModifier, Options } from "../../../lib/Core/Options.js";
import { verify } from "../../../lib/Providers/Jest/JestApprovals.js";
import { JestReporter } from "../../../lib/Providers/Jest/JestReporter.js";

function expectJestDiffAgainstApprovedGoodbye(error: any) {
  const message = error.message;
  expect(message).toMatch(/- Goodbye/);
  expect(message).toMatch(/\+ Hello/);
}

describe("JestReporter", () => {
  beforeAll(() => {
    configure({ frontLoadedReporter: null });
  });
  afterAll(() => reset());

  test("reports file contents", () => {
    try {
      // begin-snippet: configure-reporter-with-options
      const configModifier: ConfigModifier = (c) => {
        c.reporters = [new JestReporter(), "BeyondCompare"];
        return c;
      };
      let options = new Options();
      options = options.withConfig(configModifier);

      verify("Hello", options);
      // end-snippet
    } catch (error: any) {
      expectJestDiffAgainstApprovedGoodbye(error);
    }
  });

  test("options.withReporter", () => {
    try {
      verify("Hello", new Options().withReporter(new JestReporter()));
    } catch (error: any) {
      expectJestDiffAgainstApprovedGoodbye(error);
    }
  });
});
