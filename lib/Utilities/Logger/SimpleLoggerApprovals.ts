import { Options } from "../../Core/Options";
import { verify } from "../../Providers/Jest/JestApprovals";

import { SimpleLogger } from "./SimpleLogger";

export function verifySimpleLogger(
  testName: string,
  code: () => void,
  options?: Options,
) {
  test(testName, () => {
    const output = SimpleLogger.logToString();
    code();
    verify(output, options);
  });
}
