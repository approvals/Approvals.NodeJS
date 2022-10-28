import {describe, test} from "@jest/globals";
import {verify, verifyAsJson} from "../../../lib/Providers/Jest/JestApprovals";

describe("JestApprovals", () => {
    test("verify", () => {
        verify("Hello From Approvals");
    });
    test("verifyJson", () => {
        const data = {name: "fred", age: 30}
        verifyAsJson(data);
    });
});
