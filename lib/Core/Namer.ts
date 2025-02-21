import { StringUtils } from "../Utilities/StringUtils";

export interface Namer {
  getApprovedFile(ext: string): string;
  getReceivedFile(ext: string): string;
}

export function convertToFilename(name: string): string {
  const forbidden = "\\/:?\"<>|' ";
  for (let forbiddenKey of forbidden) {
    name = StringUtils.replaceAll(name, forbiddenKey, "_");
  }
  return name;
}
