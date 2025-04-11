import type { Scrubber } from "../Scrubbers/Scrubbers";
import { Namer } from "../Namer";
import { Namer as CoreNamer } from "./Namer";
import { Config } from "../config";
import { Reporter } from "./Reporter";
export type ConfigModifier = (t: any) => any;

class FileOptions {
  private options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  withFileExtention(extensionWithDot: string): Options {
    return this.options.modify("FileExtention", extensionWithDot);
  }

  getFileExtension(): string {
    return this.options.get("FileExtention", () => ".txt");
  }
}

export class Options {
  protected fields: { [n: string]: any };

  constructor() {
    this.fields = {};
  }

  modify(key: string, value: any): Options {
    const next = new Options();
    for (const key1 in this.fields) {
      next.fields[key1] = this.fields[key1];
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
    return this.fields[key];
  }

  withScrubber(scrubber: Scrubber): Options {
    return this.modify("Scrubber", scrubber);
  }

  getScrubber(): Scrubber {
    return this.get("Scrubber", () => (t) => t);
  }

  scrub(text: string): string {
    const scrubber = this.getScrubber();
    return scrubber(text);
  }

  withConfig(configModifier: ConfigModifier): Options {
    return this.modify("ConfigModifier", configModifier);
  }

  getConfig(config: any): Config {
    const modifier = this.get("ConfigModifier", () => (t: any) => t);
    return modifier(config);
  }

  withNamer(namer: CoreNamer): Options {
    return this.modify("Namer", namer);
  }

  getNamer(): CoreNamer {
    return this.get("Namer", () => new Namer("", ""));
  }

  withReporter(reporter: Reporter): Options {
    const previousModifier = this.get("ConfigModifier", () => (t: any) => t);
    const previousModifierWithReporter: ConfigModifier = (c) => {
      c = previousModifier(c);
      c.reporters = [reporter];
      return c;
    };
    return this.withConfig(previousModifierWithReporter);
  }
}
