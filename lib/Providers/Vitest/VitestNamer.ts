import path from "path";
import { Namer } from "../../Namer";
import { convertToFilename } from "../../Core/Namer";
import { StringUtils } from "../../Utilities/StringUtils";

interface VitestExpectState {
  testPath?: string;
  currentTestName?: string;
}

declare const expect: { getState(): VitestExpectState };

export function getVitestNamer(): Namer {
  const state = expect.getState();
  const file = path.parse(state.testPath as string);
  const testPath = file.dir;
  const testFileName = file.name;
  const currentTestNameWithoutSeparators = StringUtils.replaceAll(
    state.currentTestName ?? "",
    " > ",
    " ",
  );
  const testName = convertToFilename(
    `${testFileName}.${currentTestNameWithoutSeparators}`,
  );
  return new Namer(testPath, testName);
}
