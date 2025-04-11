import path from "path";
import { Namer as CoreNamer } from "./Core/Namer";

export class Namer implements CoreNamer {
  public basePath: string;
  protected name: string;

  constructor(basePath: string, name: string) {
    this.basePath = basePath || "";
    this.name = name || "";
    if (this.name.endsWith(".")) {
      this.name = this.name.slice(0, -1);
    }
  }

  protected pathCreator(type: string, ext: string = "txt"): string {
    const cleanedExt = ext.startsWith(".") ? ext.substring(1) : ext;
    return path.join(this.basePath, `${this.name}.${type}.${cleanedExt}`);
  }

  getReceivedFile(ext: string): string {
    return this.pathCreator("received", ext);
  }

  getApprovedFile(ext: string): string {
    return this.pathCreator("approved", ext);
  }
}
