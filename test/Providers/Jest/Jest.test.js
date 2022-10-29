"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const JestApprovals_1 = require("../../../lib/Providers/Jest/JestApprovals");
const JestNamer_1 = require("../../../lib/Providers/Jest/JestNamer");
(0, globals_1.describe)("JestApprovals", () => {
    (0, globals_1.test)("verify", () => {
        (0, JestApprovals_1.verify)("Hello From Approvals");
    });
    (0, globals_1.test)("convertToFilename", () => {
        (0, globals_1.expect)((0, JestNamer_1.convertToFilename)("More than one space")).toBe("More_than_one_space");
    });
    (0, globals_1.test)("verify Json", () => {
        const data = { name: "fred", age: 30 };
        (0, JestApprovals_1.verifyAsJson)(data);
    });
});
