import * as fs from 'fs';
import * as path from 'path';
import {ApprovedFileLog} from './ApprovedFileLog';
import axios from 'axios';
import { JestUtils } from "../Utilities/JestUtils";

let runOnce = false;
export class FailedFileLog {
    private static downloadedScriptCheck: boolean = false;

    private static clearLogFile(): void {
        if (!runOnce || JestUtils.isJestRunning()) {
            return;
        }
        runOnce = true;
        this.forceClearFileLog();
    }

    public static forceClearFileLog() {
        fs.writeFileSync(this.getLogFilePath(), '');
    }

    private static async downloadApproveAllScriptIfMissing(): Promise<void> {
        if (this.downloadedScriptCheck) {
            return;
        }
        this.downloadedScriptCheck = true;

        try {
            const extension = process.platform === 'win32' ? '.bat' : '.sh';
            const scriptPath = path.join(ApprovedFileLog.APPROVAL_TEMP_DIRECTORY, `approve_all${extension}`);

            if (!fs.existsSync(scriptPath)) {
                const githubUrl = 'https://raw.githubusercontent.com/approvals/ApprovalTests.Java/refs/heads/master/';
                const filePath = `resources/approve_all${extension}`;
                const response = await axios.get(`${githubUrl}${filePath}`);

                fs.writeFileSync(scriptPath, response.data);
                fs.chmodSync(scriptPath, 0o755);
            }
        } catch (error) {
            // Do nothing
        }
    }

    public static getLogFilePath(): string {
        return path.join(ApprovedFileLog.APPROVAL_TEMP_DIRECTORY, '.failed_comparison.log');
    }

    public static log(approved: string, received: string): void {
        this.downloadApproveAllScriptIfMissing().then(() => {
            const logFilePath = this.getLogFilePath();
            const logEntry = `${received} -> ${approved}\n`;
            fs.appendFileSync(logFilePath, logEntry);
        });
    }

    public static touch(): void {
        this.clearLogFile();
    }
}
