import * as fs from "fs";
import * as path from "path";
import { JestUtils } from "../Utilities/JestUtils";
import { LogUtils } from "./LogUtils";

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
      LogUtils.ensureTempDirectoryExists(),
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
