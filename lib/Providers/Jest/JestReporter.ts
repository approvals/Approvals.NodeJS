import {expect} from "@jest/globals";
const fs = require('fs');

export class JestReporter {
    name: string = "JestReporter";

    canReportOn() {
        return true;
    }

    report(approvedFilePath: string, receivedFilePath: string) {
        const approvedText = fs.readFileSync(approvedFilePath).toString();
        const receivedText = fs.readFileSync(receivedFilePath).toString();
        expect(receivedText).toBe(approvedText);
    }
}
