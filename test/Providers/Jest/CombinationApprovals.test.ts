import {describe, test} from "@jest/globals";
import {verify} from "../../../lib/Providers/Jest/JestApprovals";

const EMPTY_ENTRY = {};
const EMPTY = [EMPTY_ENTRY];

function printCombinations<T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: <T1, T2, T3, T4, T5, T6, T7, T8, T9>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9) => any,
                                                               params1: T1[],
                                                               params2: T2[],
                                                               params3: T3[],
                                                               params4: T4[],
                                                               params5: T5[],
                                                               params6: T6[],
                                                               params7: T7[],
                                                               params8: T8[],
                                                               params9: T9[]
): string {
    let text = "";
    for (let p1 of params1) {
        for (let p2 of params2) {
            for (let p3 of params3) {
                for (let p4 of params4) {
                    for (let p5 of params5) {
                        for (let p6 of params6) {
                            for (let p7 of params7) {
                                for (let p8 of params8) {
                                    for (let p9 of params9) {
                                        let output;
                                        try {
                                            output = func(p1, p2, p3, p4, p5, p6, p7, p8, p9);
                                        } catch (e) {
                                            output = `${e}`;
                                        }
                                        const parameters = [p1, p2, p3, p4, p5, p6, p7, p8, p9].filter(p => p !== EMPTY_ENTRY);

                                        text += `[${parameters}] => ${output}\n`;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return text;
}

function verifyAllCombinations1<T1>(func: (i: T1) => any, params1: T1[]) {
    // @ts-ignore
    verify(printCombinations((t1, t2, t3, t4, t5, t6, t7, t8, t9) => func(t1), params1, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY));
}

function verifyAllCombinations2<T1, T2>(func: (t1: T1, t2: T2) => any, params1: T1[], params2: T2[]) {
    // @ts-ignore
    verify(printCombinations((t1: T1, t2: T2, t3: any, t4: any, t5: any, t6: any, t7: any, t8: any, t9: any) => func(t1, t2), params1, params2, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY));
}


function verifyAllCombinations3<T1, T2, T3>(func: (t1: T1, t2: T2, t3: T3) => any, params1: T1[], params2: T2[], params3: T3[]) {
    // @ts-ignore
    verify(printCombinations((t1: T1, t2: T2, t3: T3, t4: any, t5: any, t6: any, t7: any, t8: any, t9: any) => func(t1, t2, t3), params1, params2, params3, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY));
}

function verifyAllCombinations4<T1, T2, T3, T4>(func: (t1: T1, t2: T2, t3: T3, t4: T4) => any, params1: T1[], params2: T2[], params3: T3[], params4: T4[]) {
    // @ts-ignore
    verify(printCombinations((t1: T1, t2: T2, t3: T3, t4: T4, t5: any, t6: any, t7: any, t8: any, t9: any) => func(t1, t2, t3, t4), params1, params2, params3, params4, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY));
}

function verifyAllCombinations5<T1, T2, T3, T4, T5>(func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => any, params1: T1[], params2: T2[], params3: T3[], params4: T4[], params5: T5[]) {
    // @ts-ignore
    verify(printCombinations((t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: any, t7: any, t8: any, t9: any) => func(t1, t2, t3, t4, t5), params1, params2, params3, params4, params5, EMPTY, EMPTY, EMPTY, EMPTY));
}

function verifyAllCombinations6<T1, T2, T3, T4, T5, T6>(func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => any, params1: T1[], params2: T2[], params3: T3[], params4: T4[], params5: T5[], params6: T6[]) {
    // @ts-ignore
    verify(printCombinations((t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: any, t8: any, t9: any) => func(t1, t2, t3, t4, t5, t6), params1, params2, params3, params4, params5, params6, EMPTY, EMPTY, EMPTY));
}

function verifyAllCombinations7<T1, T2, T3, T4, T5, T6,T7>(func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7:T6) => any, params1: T1[], params2: T2[], params3: T3[], params4: T4[], params5: T5[], params6: T6[], params7: T7[]) {
    // @ts-ignore
    verify(printCombinations((t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: any, t9: any) => func(t1, t2, t3, t4, t5, t6,t7), params1, params2, params3, params4, params5, params6, params7, EMPTY, EMPTY));
}


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
});
