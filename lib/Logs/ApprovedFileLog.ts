import * as fs from 'fs';
import * as path from 'path';

export class ApprovedFileLog {
    public static readonly APPROVAL_TEMP_DIRECTORY: string = '.approval_tests_temp';

    static {
        this.ensureLogFileExists();
    }

    private static ensureLogFileExists(): void {
        const logFilePath = this.getLogFilePath();
        if (!fs.existsSync(this.APPROVAL_TEMP_DIRECTORY)) {
            fs.mkdirSync(this.APPROVAL_TEMP_DIRECTORY);
        }
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, '');
        }
    }

    private static getLogFilePath(): string {
        return path.join(this.APPROVAL_TEMP_DIRECTORY, '.approved_files.log');
    }

    public static log(filePath: string): void {
        const logFilePath = this.getLogFilePath();
        fs.appendFileSync(logFilePath, filePath + '\n');
    }
}
