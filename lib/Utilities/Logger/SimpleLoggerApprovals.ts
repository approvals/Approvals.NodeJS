import {Options} from "../../Core/Options";
import {SimpleLogger} from "./SimpleLogger";
import {verify} from "../../Providers/Jest/JestApprovals";

export function verifySimpleLogger(testName: string, code: () => void, options?: Options) {
    test(testName, () => {
        const output = SimpleLogger.logToString()
        code();
        verify(output, options);
    });
}
