import { expect } from "@jest/globals";
import type { ApprovalFailureReporter } from "../../Core/ApprovalFailureReporter";
import fs from "fs";
import { Config } from "../../config";
import { Reporter } from "../../Core/Reporter";

export class JestReporter implements Reporter {
  name: string = "JestReporter";

  canReportOn(_fileName: string) {
    return true;
  }

  report(
    approvedFilePath: string,
    receivedFilePath: string,
    options: Partial<Config>,
  ) {
    const approvedText = fs.readFileSync(approvedFilePath).toString();
    const receivedText = fs.readFileSync(receivedFilePath).toString();
    expect(receivedText).toBe(approvedText);
  }
}
