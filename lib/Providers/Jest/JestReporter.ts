import { isFrameworkAvailable } from "../OptionalFramework";
import fs from "fs";
import { Config } from "../../config";
import { Reporter } from "../../Core/Reporter";

export class JestReporter implements Reporter {
  name: string = "JestReporter";

  canReportOn(_fileName: string) {
    return isFrameworkAvailable("jest");
  }

  report(
    approvedFilePath: string,
    receivedFilePath: string,
    _: Partial<Config>,
  ) {
    if (!isFrameworkAvailable("jest")) return;
    const { expect } =
      require("@jest/globals") as typeof import("@jest/globals");
    const approvedText = fs.readFileSync(approvedFilePath).toString();
    const receivedText = fs.readFileSync(receivedFilePath).toString();
    expect(receivedText).toBe(approvedText);
  }
}
