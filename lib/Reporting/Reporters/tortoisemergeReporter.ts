import { searchForExecutable } from "../../AUtils";
import { GenericDiffReporterBase } from "../GenericDiffReporterBase";

export default class TortoiseMergeReporter extends GenericDiffReporterBase {
  constructor() {
    super("TortoiseMerge");

    var rootPaths = ["TortoiseGit/bin", "TortoiseSVN/bin"];
    var exeNames = ["TortoiseGitMerge.exe", "TortoiseMerge.exe"];
    let path: string = "";

    for (var i = 0; i < rootPaths.length; i++) {
      for (var j = 0; j < exeNames.length; j++) {
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
