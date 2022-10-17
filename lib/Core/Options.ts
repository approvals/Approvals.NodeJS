class FileOptions {
  private options: Options;
  constructor(options: Options) {
    this.options = options;
  }

  withFileExtention(extensionWithDot: string): Options {
    return this.options.modify("FileExtention", extensionWithDot);

  }

  getFileExtension(): string {
    return this.options.get("FileExtention", () => ".txt")
  }
}

export class Options {
  protected fields: { [n: string]: any };
  constructor() {
    this.fields = {}
  }

  modify(key: string, value: any): Options {
    const next = new Options();
    for (const key1 in next.fields) {
      next.fields[key1] = this.fields[key1]
    }
    next.fields[key] = value;
    return next;
  }
  forFile(): FileOptions {
    return new FileOptions(this);
  }

  get<Type>(key: string, default1: () => Type): Type {
    if (this.fields[key] == undefined) {
      return default1();
    }
    return this.fields[key]

  }
}