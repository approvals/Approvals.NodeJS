import { printArray, printJson } from "../../Utilities/Printers";
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
import { Options } from "../../Core/Options";
import { getJestNamer } from "./JestNamer";

import { StringWriter } from "../../StringWriter";
const approvals = require("../../Approvals");

export function verify(sut: any, options?: Options): void {
  options = options || new Options();
  options = options.withNamer(getJestNamer());
  const config = options.getConfig(approvals.getConfig());
  const scrubbed = options.scrub(`${sut}`);
  const writer = new StringWriter(
    config,
    scrubbed,
    options.forFile().getFileExtension(),
  );
  let namer = options.getNamer();
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
