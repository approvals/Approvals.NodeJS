import * as fs from "fs";
import * as path from "path";
import { JestUtils } from "../Utilities/JestUtils";
import { helpUserSetupJest } from "../Providers/Jest/JestSetup";
import axios from "axios";

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

export class LogUtils {
  private static runOnce: boolean = false;
  public static readonly APPROVAL_TEMP_DIRECTORY: string =
    ".approval_tests_temp";

  public static ensureTempDirectoryExists() {
    if (this.runOnce) {
      return this.APPROVAL_TEMP_DIRECTORY;
    }
    this.runOnce = true;

    if (!fs.existsSync(this.APPROVAL_TEMP_DIRECTORY)) {
      fs.mkdirSync(this.APPROVAL_TEMP_DIRECTORY);
    }
    this.downloadApproveAllScriptIfMissing().then();
    return this.APPROVAL_TEMP_DIRECTORY;
  }

  private static async downloadApproveAllScriptIfMissing(): Promise<void> {
    await this.downloadFile(`approve_all.py`);
    await this.downloadFile(`remove_abandoned_files.py`);
  }

  private static async downloadFile(script: string) {
    try {
      const scriptPath = path.join(this.APPROVAL_TEMP_DIRECTORY, script);

      if (!fs.existsSync(scriptPath)) {
        const githubUrl =
          "https://raw.githubusercontent.com/approvals/ApprovalTests.CommonScripts/refs/heads/main/";
        const response = await axios.get(`${githubUrl}${script}`);

        fs.writeFileSync(scriptPath, response.data);
        fs.chmodSync(scriptPath, 0o755);
      }
    } catch (error) {
      // Do nothing
    }
  }
}
