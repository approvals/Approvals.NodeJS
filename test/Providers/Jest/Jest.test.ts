import {describe, expect, test} from "@jest/globals";
import {verify, verifyAsJson} from "../../../lib/Providers/Jest/JestApprovals";
import {convertToFilename} from "../../../lib/Providers/Jest/JestNamer";

describe("JestApprovals", () => {
    test("verify", () => {
        verify("Hello From Approvals");
    });
    test("convertToFilename", () => {
        expect(convertToFilename("More than one space")).toBe("More_than_one_space")
    })
    test("verify Json", () => {
        const data = {name: "fred", age: 30}
        verifyAsJson(data);
    });
});
