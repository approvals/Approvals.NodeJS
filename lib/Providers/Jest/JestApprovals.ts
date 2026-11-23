import { getConfig, verifyWithControl } from "../../Approvals";
import { Options } from "../../Core/Options";
import { StringWriter } from "../../StringWriter";
import { printArray, printJson } from "../../Utilities/Printers";
import { isFrameworkAvailable } from "../OptionalFramework";

import { getJestNamer } from "./JestNamer";

export function verify(sut: any, options?: Options): void {
  if (!isFrameworkAvailable("jest")) {
    return;
  }
  options = options || new Options();
  options = options.withNamer(getJestNamer());
  const config = options.getConfig(getConfig());
  const scrubbed = options.scrub(`${sut}`);
  const writer = new StringWriter(
    config,
    scrubbed,
    options.forFile().getFileExtension(),
  );
  const namer = options.getNamer();
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
