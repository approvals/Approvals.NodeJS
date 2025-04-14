import fs from "fs";
import path from "path";
import axios from "axios";

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
