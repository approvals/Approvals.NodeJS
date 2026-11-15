import { searchForExecutable } from "../../AUtils";
import { GenericDiffReporterBase } from "../GenericDiffReporterBase";

export default class TortoiseMergeReporter extends GenericDiffReporterBase {
  constructor() {
    super("TortoiseMerge");

    const rootPaths = ["TortoiseGit/bin", "TortoiseSVN/bin"];
    const exeNames = ["TortoiseGitMerge.exe", "TortoiseMerge.exe"];
    let path: string = "";

    for (let i = 0; i < rootPaths.length; i++) {
      for (let j = 0; j < exeNames.length; j++) {
        path = searchForExecutable(rootPaths[i], exeNames[j]);
        if (path) {
          break;
        }
      }
      if (path) {
        break;
      }
    }
    this.exePath = path;
  }
}
