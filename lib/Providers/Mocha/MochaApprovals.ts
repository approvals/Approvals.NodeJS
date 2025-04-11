import {printArray, printJson} from "../../Utilities/Printers";
/* ^^^ If the above line is failing, please add
# 1. Jest Config
```
"transformIgnorePatterns": ["node_modules/@3ds"]
```

# 2. tsconfig.json
```
    "esModuleInterop": true
```
*/
import {Options} from "../../Core/Options";
import {getMochaNamer} from "./MochaNamer";
import mocha from "mocha";

import StringWriter from "../../StringWriter";

import * as approvals from "../../Approvals";
import {Namer} from "../../Core/Namer";

let mochaTest: any = null;

export function it2(label: string, test: () => void): void {
    mocha.it(label, function (this: any) {
        mochaTest = this;
        console.log("Mocha Test: ", mochaTest.test.name);
        test();
    });
}

let namer: Namer;

export function setNamer(that: any): void {
    namer = getMochaNamer(that.currentTest);
}

export function getNamer(): Namer {
    return namer;
}

export function verify(sut: any, options?: Options): void {
    options = options || new Options();
    options = options.withNamer(getNamer());
    const config = options.getConfig(approvals.getConfig());
    const scrubbed = options.scrub(`${sut}`);
    const writer = new StringWriter(
        config,
        scrubbed,
        options.forFile().getFileExtension(),
    );
    approvals.verifyWithControl(namer, writer, null, config);
}

export function verifyAsJson(data: any, options?: Options): void {
    const text = printJson(data);
    options = options || new Options();
    options = options.forFile().withFileExtention(".json");
    verify(text, options);
}

export function verifyAll<T>(
    header: string,
    list: T[],
    formatter?: (element: T) => string,
    options?: Options,
): void {
    const text = printArray(header, list, formatter);
    verify(text, options);
}
