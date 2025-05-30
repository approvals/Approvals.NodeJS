import path from "path";
import { Namer } from "../../Namer";
import { Runnable, Suite } from "mocha";
import { convertToFilename } from "../../Core/Namer";

export class MochaNamer extends Namer {
  // @ts-ignore errors if Mocha is not used
  private ctx: Mocha.Runnable;

  // @ts-ignore errors if Mocha is not used
  constructor(mochaTest: Mocha.Context, overrideBasePath?: string) {
    if (!mochaTest || !mochaTest.test) {
      throw new Error("Mocha test context was not supplied");
    }

    super("", "");

    this.ctx = mochaTest.test;
    this.basePath = overrideBasePath || path.dirname(this.ctx.file!);
  }

  getFullTestName(testContext: Runnable): string {
    let test = testContext;

    let parentStack: (Runnable | Suite)[] = [];
    let currParent: Runnable | undefined | Suite = test;
    while (currParent && currParent.parent) {
      parentStack.push(currParent);
      currParent = currParent.parent;
    }

    let newTitle = "";
    let parentStackReversed = parentStack.reverse();
    parentStackReversed.forEach((item, index) => {
      if (index !== 0) {
        newTitle += ".";
      }

      newTitle += item.title
        .split(" ")
        .join("_")
        .replace(/[^\w\s]/gi, "_");
    });

    return newTitle;
  }

  pathCreator(type: string, ext: string): string {
    if (!this.name) {
      if (!this.ctx) {
        throw new Error("ctx was not defined.");
      }
      this.name = this.getFullTestName(this.ctx);
    }

    return super.pathCreator(type, ext);
  }
}

function getTitleChain(test: any, pieces: string[] = []): string[] {
  if (test.title && test.title.length > 0) {
    pieces.unshift(test.title);
  }
  if (test.parent) {
    return getTitleChain(test.parent, pieces);
  }
  return pieces;
}

export function getMochaNamer(test: any): Namer {
  if (!test || !test.file || !test.title) {
    throw new Error(
      `Test context is missing required properties.\ntitle:${test.title}\nfile:${test.file}`,
    );
  }

  const file = path.parse(test.file);
  const testPath = file.dir;
  const testFileName = file.name;
  const pieces: string[] = getTitleChain(test);
  const testName = convertToFilename(`${testFileName}.${pieces.join(".")}`);

  return new Namer(testPath, testName);
}
