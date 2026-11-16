import fs from "fs";

import jsdiff from "diff";

import {
  assertFileExists,
  createEmptyFileIfNotExists,
  isBinaryFile,
} from "../../AUtils";
import { Reporter } from "../../Core/Reporter";
import { grayText, greenText, redText } from "../../Utilities/ConsoleUtils";

function colorByChangeType(part: jsdiff.Change): string {
  if (part.added) {
    return greenText(part.value);
  }
  if (part.removed) {
    return redText(part.value);
  }
  return grayText(part.value);
}

export default class NodeDiffReporter implements Reporter {
  public name: string;

  constructor() {
    this.name = "nodediff";
  }

  canReportOn(fileName) {
    assertFileExists(fileName);

    const isBinary = isBinaryFile(fileName);
    if (isBinary) {
      return false;
    }

    return true;
  }

  report(approved, received, _options): void {
    createEmptyFileIfNotExists(approved);

    const approvedText = fs.readFileSync(approved).toString();
    const receivedText = fs.readFileSync(received).toString();

    console.log(`*******************************************`);
    console.log(`* Showing diff for ${approved} vs ${received}\n`);

    const diff = jsdiff.diffChars(approvedText, receivedText);

    diff.forEach((part) => process.stdout.write(colorByChangeType(part)));

    console.log(`\n* End of diff for ${approved} vs ${received}`);
    console.log(`*******************************************\n\n`);
  }
}
