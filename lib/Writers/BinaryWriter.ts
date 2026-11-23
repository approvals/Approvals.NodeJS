import fs from "fs";
import path from "path";

import { filetypeextension } from "magic-bytes.js";
import { sync } from "mkdirp";

import { Writer } from "../Core/Writer";

const legacyApprovalFileExtensions = new Map<string, string>([
  ["jpeg", "jpg"],
  ["tiff", "tif"],
]);

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
      this._ext = legacyApprovalFileExtensions.get(extension) ?? extension;
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
