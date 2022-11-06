import {describe, expect, test} from "@jest/globals";
import {verify, verifyAll, verifyAsJson} from "../../../lib/Providers/Jest/JestApprovals";
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

describe("verifyAll", ( )=>{
    test("basics", ()=> {
        const digits = [1,2,3,4,5];
        verifyAll("Squared", digits, d => `${d} => ${d*d}` );
    });

    test("default formatter", ()=> {
        const digits = ["a","b","c"];
        verifyAll("Print", digits);
    });
});
