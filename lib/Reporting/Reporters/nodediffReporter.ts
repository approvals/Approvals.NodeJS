import fs from "fs";

import jsdiff from "diff";

import {
  assertFileExists,
  createEmptyFileIfNotExists,
  isBinaryFile,
} from "../../AUtils";
import { Reporter } from "../../Core/Reporter";
import { grayText, greenText, redText } from "../../Utilities/ConsoleUtils";

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

    diff.forEach(function (part) {
      // green for additions, red for deletions
      // grey for common parts
      let text;
      if (part.added) {
        text = greenText(part.value);
      } else {
        if (part.removed) {
          text = redText(part.value);
        } else {
          text = grayText(part.value);
        }
      }

      process.stdout.write(text);
    });

    console.log(`\n* End of diff for ${approved} vs ${received}`);
    console.log(`*******************************************\n\n`);
  }
}
