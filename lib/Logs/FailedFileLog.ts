import * as fs from "fs";
import * as path from "path";
import { ApprovedFileLog } from "./ApprovedFileLog";
import { JestUtils } from "../Utilities/JestUtils";

let runOnce = false;
export class FailedFileLog {
  private static clearLogFile(): void {
    if (!runOnce || JestUtils.isJestRunning()) {
      return;
    }
    runOnce = true;
    this.forceClearFileLog();
  }

  public static forceClearFileLog() {
    fs.writeFileSync(this.getLogFilePath(), "");
  }

  public static getLogFilePath(): string {
    return path.join(
      ApprovedFileLog.APPROVAL_TEMP_DIRECTORY,
      ".failed_comparison.log",
    );
  }

  public static log(approved: string, received: string): void {
    const logFilePath = this.getLogFilePath();
    const logEntry = `${received} -> ${approved}\n`;
    fs.appendFileSync(logFilePath, logEntry);
  }

  public static touch(): void {
    this.clearLogFile();
  }
}
