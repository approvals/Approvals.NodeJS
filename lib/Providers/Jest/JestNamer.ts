import {expect} from "@jest/globals";
import path from "path";
import {StringUtils} from "../../Utilities/StringUtils";
import {Namer} from "../../Namer";

export function convertToFilename(name: string): string {
    const forbidden = "\\/:?\"<>|' ";
    for (let forbiddenKey of forbidden) {
        name = StringUtils.replaceAll(name, forbiddenKey, "_");
    }
    return name;
}

export function getJestNamer(): Namer {
    const state = expect.getState();
    const file = path.parse(state.testPath as string);
    const testPath = file.dir;
    const testFileName = file.name;
    const testName = convertToFilename(`${testFileName}.${state.currentTestName}`);
    return new Namer(testPath, testName);
}
