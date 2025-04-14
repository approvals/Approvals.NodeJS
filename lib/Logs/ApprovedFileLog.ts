import * as fs from "fs";
import * as path from "path";
import { JestUtils } from "../Utilities/JestUtils";
import { helpUserSetupJest } from "../Providers/Jest/JestSetup";
import axios from "axios";

let runOnce = false;
export class ApprovedFileLog {
  private static downloadedScriptCheck: boolean = false;
  public static readonly APPROVAL_TEMP_DIRECTORY: string =
    ".approval_tests_temp";

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
    const logFilePath = this.ensureTempDirectoryExists();
    fs.writeFileSync(logFilePath, "");
  }

  public static ensureTempDirectoryExists() {
    const logFilePath = this.getLogFilePath();
    if (!fs.existsSync(this.APPROVAL_TEMP_DIRECTORY)) {
      fs.mkdirSync(this.APPROVAL_TEMP_DIRECTORY);
    }
    this.downloadApproveAllScriptIfMissing().then();
    return logFilePath;
  }

  private static async downloadApproveAllScriptIfMissing(): Promise<void> {
    if (this.downloadedScriptCheck) {
      return;
    }
    this.downloadedScriptCheck = true;

    await this.downloadFile(`approve_all.py`);
    await this.downloadFile(`remove_abandoned_files.py`);
  }

  public static async downloadFile(script: string) {
    try {
      const scriptPath = path.join(
        ApprovedFileLog.APPROVAL_TEMP_DIRECTORY,
        script,
      );

      if (!fs.existsSync(scriptPath)) {
        const githubUrl =
          "https://raw.githubusercontent.com/approvals/ApprovalTests.CommonScripts/refs/heads/main/";
        const filePath = `${script}`;
        const response = await axios.get(`${githubUrl}${filePath}`);

        fs.writeFileSync(scriptPath, response.data);
        fs.chmodSync(scriptPath, 0o755);
      }
    } catch (error) {
      // Do nothing
    }
  }

  private static getLogFilePath(): string {
    return path.join(this.APPROVAL_TEMP_DIRECTORY, ".approved_files.log");
  }

  public static log(filePath: string): void {
    this.clearLogFile();
    const logFilePath = this.getLogFilePath();
    fs.appendFileSync(logFilePath, filePath + "\n");
  }
}
