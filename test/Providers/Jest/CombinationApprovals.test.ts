import {describe, test} from "@jest/globals";
import {
    verifyAllCombinations1,
    verifyAllCombinations2,
    verifyAllCombinations3,
    verifyAllCombinations4,
    verifyAllCombinations5,
    verifyAllCombinations6,
    verifyAllCombinations7, verifyAllCombinations8, verifyAllCombinations9
} from "../../../lib/Providers/Jest/CombinationApprovals";


describe("Combinations", () => {
    test("verify1", () => {
        function binarySquare(i: number) {
            if (i === 2) {
                throw new Error("There is no 2");
            }
            return i;
        }

        const numbers = [0, 1, 2];
        verifyAllCombinations1(binarySquare, numbers);
    });
    test("verify2", () => {
        const numbers = [0, 1, 2];
        verifyAllCombinations2((a, b) => a + b, numbers, numbers);
    });
    test("verify3", () => {
        const numbers = [3, 4];
        verifyAllCombinations3((a, b, c) => a * b * c, numbers, numbers, numbers);
    });
    test("verify4", () => {
        const numbers = [3, 4];
        verifyAllCombinations4((a, b, c, d) => a + "" + b + c + d, numbers, numbers, numbers, numbers);
    });
    test("verify5", () => {
        verifyAllCombinations5((a, b, c, d, e) => e + d + c + b + a, ["a", "b"], ["a", "b"], ["c", "d"], ["e", "f"], ["g", "h", "i"]);
    });
    test("verify6", () => {
        verifyAllCombinations6((a, b, c, d, e, f) => "#" + a + " " + f + e + d + c + b, [1, 2], ["a", "b"], ["c", "d"], ["e", "f"], ["i", "j"], ["g", "h"]);
    });
    test("verify7", () => {
        verifyAllCombinations7((a, b, c, d, e, f, g) => a + b + c + d + e + f + g, [1, 2], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3]);
    });
    test("verify8", () => {
        verifyAllCombinations8((a, b, c, d, e, f, g, h) => a + b + c + d + e + f + g + h, [1, 2], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [8, 7]);
    });
    test("verify9", () => {
        verifyAllCombinations9((a, b, c, d, e, f, g, h, i) => "" + a + b + c + d + e + f + g + h + i, [1, 2], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [2, 3], [8, 7], [9, 8]);
    });
});
