import * as fs from "fs";
import * as path from "path";
import mkdirp from "mkdirp";
import fileType from "file-type"; // Assuming fileType provides synchronous methods

interface Config {
  // Define the structure of Config based on your application's needs
  [key: string]: any;
}

export class BinaryWriter {
  private config: Config;
  private outputData: Buffer;
  private _ext?: string;

  constructor(config: Config, outputData: Buffer) {
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
