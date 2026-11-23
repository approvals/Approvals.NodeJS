import { getConfig, verifyWithControl } from "../../Approvals";
import { Namer } from "../../Core/Namer";
import { Options } from "../../Core/Options";
import StringWriter from "../../StringWriter";
import { printArray, printJson } from "../../Utilities/Printers";
import { isFrameworkAvailable } from "../OptionalFramework";

import { getMochaNamer } from "./MochaNamer";

let mochaTest: any = null;

export function it2(label: string, test: () => void): void {
  if (!isFrameworkAvailable("mocha")) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mocha = require("mocha") as typeof import("mocha");
  mocha.it(label, function (this: any) {
    mochaTest = this;
    console.log("Mocha Test: ", mochaTest.test.name);
    test();
  });
}

let namer: Namer;

export function setNamer(that: any): void {
  if (!isFrameworkAvailable("mocha")) {
    return;
  }
  namer = getMochaNamer(that.currentTest);
}

export function getNamer(): Namer {
  return namer;
}

export function verify(sut: any, options?: Options): void {
  if (!isFrameworkAvailable("mocha")) {
    return;
  }
  options = options || new Options();
  options = options.withNamer(getNamer());
  const config = options.getConfig(getConfig());
  const scrubbed = options.scrub(`${sut}`);
  const writer = new StringWriter(
    config,
    scrubbed,
    options.forFile().getFileExtension(),
  );
  verifyWithControl(namer, writer, null, config);
}

export function verifyAsJson(data: any, options?: Options): void {
  const text = printJson(data);
  options = options || new Options();
  options = options.forFile().withFileExtension(".json");
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
