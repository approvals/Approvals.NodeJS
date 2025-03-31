import * as fs from "fs";
import * as path from "path";
import * as autils from "./AUtils";
import { Config } from "./config";
import { sync } from "mkdirp";
import { Writer } from "./Core/Writer";

const lineEndingRegex = new RegExp("\r?\n", "g");

function normalizeLineEndings(
  lineEnding: string | any,
  value: string | any,
): string {
  if (autils.isBinaryFile(value)) {
    return value;
  }
  return value.replace(lineEndingRegex, lineEnding);
}

export class StringWriter implements Writer {
  private config: Partial<Config>;
  private ext: string;
  public outputText: string;

  constructor(config: Partial<Config>, outputText: string, ext?: string) {
    if (typeof outputText !== "string") {
      throw new Error(
        `The outputText provided is not a 'string' value but is a typeof ${typeof outputText}`,
      );
    }

    this.config = config;
    this.ext = ext || "txt";
    this.outputText = outputText;
  }

  getFileExtension(): string {
    return this.ext;
  }

  write(filePath: string): void {
    const dir = path.dirname(path.normalize(filePath));
    if (!fs.existsSync(dir)) {
      sync(dir);
    }

    if (
      this.config.normalizeLineEndingsTo !== false &&
      this.config.normalizeLineEndingsTo !== undefined
    ) {
      this.outputText = normalizeLineEndings(
        this.config.normalizeLineEndingsTo as string,
        this.outputText,
      );
    }

    if (this.config.appendEOL) {
      const CRLF = "\r\n";
      const LF = "\n";

      const endsWithCRLF = this.outputText.endsWith(CRLF);
      const endsWithLF = this.outputText.endsWith(LF);

      if (!endsWithCRLF && !endsWithLF) {
        this.outputText += this.config.EOL;
      }
    }

    fs.writeFileSync(filePath, this.outputText);
  }
}

export default StringWriter;
