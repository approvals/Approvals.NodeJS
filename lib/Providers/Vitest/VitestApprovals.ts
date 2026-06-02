import { printArray, printJson } from "../../Utilities/Printers";
import { Options } from "../../Core/Options";
import { getVitestNamer } from "./VitestNamer";

import { StringWriter } from "../../StringWriter";
import * as approvals from "../../Approvals";

export function verify(sut: any, options?: Options): void {
  options = options || new Options();
  options = options.withNamer(getVitestNamer());
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
