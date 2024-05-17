import { searchForExecutable } from "../../AUtils";
import { platform } from "../../osTools";
import GenericDiffReporterBase from "../GenericDiffReporterBase";
import shelljs from "shelljs";

export default class BeyondCompareReporter extends GenericDiffReporterBase {
  constructor() {
    super("BeyondCompare");

    let app: string = "";
    if (platform.isMac) {
      try {
        app = shelljs.ls(
          "/Applications/Beyond Compare.app/Contents/MacOS/bcomp",
        )[0];
      } catch (err) {
        console.error(err);
      }
      app = app || searchForExecutable("bcomp");
    } else if (platform.isWindows) {
      app =
        searchForExecutable("Beyond Compare 4", "BCompare.exe") ||
        searchForExecutable("Beyond Compare 3", "BCompare.exe");
    }

    app = app || searchForExecutable("bcomp");

    this.exePath = app;
  }
}
