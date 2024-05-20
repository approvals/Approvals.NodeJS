import { expect } from "@jest/globals";
import type { ApprovalFailureReporter } from "../../Core/ApprovalFailureReporter";
import fs from "fs";

export class JestReporter implements ApprovalFailureReporter {
  name: string = "JestReporter";

  canReportOn() {
    return true;
  }

  report(approvedFilePath: string, receivedFilePath: string) {
    const approvedText = fs.readFileSync(approvedFilePath).toString();
    const receivedText = fs.readFileSync(receivedFilePath).toString();
    expect(receivedText).toBe(approvedText);
  }
}
