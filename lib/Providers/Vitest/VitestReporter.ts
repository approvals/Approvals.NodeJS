import fs from "fs";
import { Config } from "../../config";
import { Reporter } from "../../Core/Reporter";

declare const expect: (actual: unknown) => { toBe(expected: unknown): void };

export class VitestReporter implements Reporter {
  name: string = "VitestReporter";

  canReportOn(_fileName: string) {
    return true;
  }

  report(
    approvedFilePath: string,
    receivedFilePath: string,
    _: Partial<Config>,
  ) {
    const approvedText = fs.readFileSync(approvedFilePath).toString();
    const receivedText = fs.readFileSync(receivedFilePath).toString();
    expect(receivedText).toBe(approvedText);
  }
}
