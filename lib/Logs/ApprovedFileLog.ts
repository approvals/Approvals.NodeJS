import * as fs from 'fs';
import * as path from 'path';
import { JestUtils } from '../Utilities/JestUtils';

let runOnce = false;
export class ApprovedFileLog {
    public static readonly APPROVAL_TEMP_DIRECTORY: string = '.approval_tests_temp';

    private static clearLogFile(): void {
        if (runOnce) {
            return;
        }
        if (JestUtils.isJestRunning()) {
            return;
        }
        runOnce = true;
        this.forceClearLogFile();
    }

    public static forceClearLogFile() {
        const logFilePath = this.getLogFilePath();
        if (!fs.existsSync(this.APPROVAL_TEMP_DIRECTORY)) {
            fs.mkdirSync(this.APPROVAL_TEMP_DIRECTORY);
        }
        fs.writeFileSync(logFilePath, '');
    }

    private static getLogFilePath(): string {
        return path.join(this.APPROVAL_TEMP_DIRECTORY, '.approved_files.log');
    }

    public static log(filePath: string): void {
        this.clearLogFile();
        const logFilePath = this.getLogFilePath();
        fs.appendFileSync(logFilePath, filePath + '\n');
    }
}
