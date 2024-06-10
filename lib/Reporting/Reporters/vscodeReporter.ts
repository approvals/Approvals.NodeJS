import GenericDiffReporterBase from "../GenericDiffReporterBase";
import { platform } from "../../osTools";
import { createEmptyFileIfNotExists, searchForExecutable } from "../../AUtils";

export default class VSCodeReporter extends GenericDiffReporterBase {
  constructor() {
    super("vscode");

    if (platform.isWindows) {
      this.exePath = searchForExecutable("code.cmd");
    } else {
      this.exePath = searchForExecutable("code");
    }
  }

  report(approved, received, options) {
    createEmptyFileIfNotExists(approved);

    options.cmdArgs = ["-n", "--diff", received, approved];
    options.cmdOptionOverrides = {
      detached: true,
    };

    return super.report(approved, received, options);
  }
}
