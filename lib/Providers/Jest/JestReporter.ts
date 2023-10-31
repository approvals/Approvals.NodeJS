import {expect} from "@jest/globals";
import type {ApprovalFailureReporter} from "../../Core/ApprovalFailureReporter";

const fs = require('fs');

export class JestReporter implements ApprovalFailureReporter {
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
