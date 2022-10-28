"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const JestApprovals_1 = require("../../../lib/Providers/Jest/JestApprovals");
(0, globals_1.describe)("JestApprovals", () => {
    (0, globals_1.test)("verify", () => {
        (0, JestApprovals_1.verify)("Hello From Approvals");
    });
    (0, globals_1.test)("verifyJson", () => {
        const data = { name: "fred", age: 30 };
        (0, JestApprovals_1.verifyAsJson)(data);
    });
});
