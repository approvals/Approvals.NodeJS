import { Namer } from "./Namer";

export class ManualNamer extends Namer {
  constructor(dirName: string, testFileName: string) {
    super(dirName, testFileName);
    this.basePath = dirName;
    this.name = testFileName;
  }
}
