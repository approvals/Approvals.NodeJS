import * as fs from "fs";
import * as path from "path";
import { JestUtils } from "../Utilities/JestUtils";
import { helpUserSetupJest } from "../Providers/Jest/JestSetup";
import { LogUtils } from "./LogUtils";

let runOnce = false;
export class ApprovedFileLog {
  private static clearLogFile(): void {
    if (runOnce) {
      return;
    }
    if (JestUtils.isJestRunning()) {
      helpUserSetupJest(this.getLogFilePath());
      return;
    }
    runOnce = true;
    this.forceClearLogFile();
  }

  public static forceClearLogFile() {
    const logFilePath = this.getLogFilePath();
    fs.writeFileSync(logFilePath, "");
  }

  private static getLogFilePath(): string {
    return path.join(
      LogUtils.ensureTempDirectoryExists(),
      ".approved_files.log",
    );
  }

  public static log(filePath: string): void {
    this.clearLogFile();
    const logFilePath = this.getLogFilePath();
    fs.appendFileSync(logFilePath, filePath + "\n");
  }
}
