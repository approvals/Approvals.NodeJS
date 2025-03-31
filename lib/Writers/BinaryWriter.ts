import * as fs from "fs";
import * as path from "path";
import mkdirp from "mkdirp";
import fileType from "file-type"; // Assuming fileType provides synchronous methods
import {Config} from "../config";
import {Writer} from "../Core/Writer";

export class BinaryWriter implements Writer {
  private config: Partial<Config>;
  private outputData: Buffer;
  private _ext?: string;

  constructor(config: Partial<Config>, outputData: Buffer) {
    this.config = config;
    this.outputData = outputData;
  }

  getFileExtension(): string {
    if (!this._ext) {
      const fileTypeDiscovered = fileType(this.outputData);
      this._ext = fileTypeDiscovered?.ext || "blob"; // Assuming synchronous call
    }
    return this._ext;
  }

  write(filePath: string): void {
    const dir = path.dirname(path.normalize(filePath));
    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir);
    }

    fs.writeFileSync(filePath, this.outputData);
  }
}
