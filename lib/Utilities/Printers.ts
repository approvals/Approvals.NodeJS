export function printArray<T>(header: string, list: T[], formatter?: ((element: T) => string)): string {
    function getDefaultFormatter() {
        let count = 0;
        return (t: T): string => `[${count++}] => ${t}`;
    }

    formatter = formatter || getDefaultFormatter();
    let text = "";
    if (header) {
        text = header + "\n\n\n";
    }
    for (let t of list) {
        text += formatter(t) + "\n"
    }
    return text;

}

export function printJson(data: any) {
    return JSON.stringify(data, null, "  ");
}

const EMPTY_ENTRY = {};
export const EMPTY = [EMPTY_ENTRY];

export function printCombinations<T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: <T1, T2, T3, T4, T5, T6, T7, T8, T9>(t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9) => any,
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
