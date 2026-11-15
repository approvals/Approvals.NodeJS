import * as fs from "fs";
import * as path from "path";
import { sync } from "mkdirp";
import { filetypeextension } from "magic-bytes.js";
import { Writer } from "../Core/Writer";

export class BinaryWriter implements Writer {
  private outputData: Buffer;
  private _ext?: string;

  constructor(outputData: Buffer) {
    this.outputData = outputData;
  }

  getFileExtension(): string {
    if (!this._ext) {
      // Use the first signature match (for example, zip before jar/docx).
      const extension = filetypeextension(this.outputData)[0] || "blob";
      // Keep existing JPEG and TIFF approval filenames compatible.
      switch (extension) {
        case "jpeg":
          this._ext = "jpg";
          break;
        case "tiff":
          this._ext = "tif";
          break;
        default:
          this._ext = extension;
      }
    }
    return this._ext;
  }

  write(filePath: string): void {
    const dir = path.dirname(path.normalize(filePath));
    if (!fs.existsSync(dir)) {
      sync(dir);
    }

    fs.writeFileSync(filePath, this.outputData);
  }
}
