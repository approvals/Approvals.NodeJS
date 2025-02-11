import { platform } from "../../osTools";
import { createEmptyFileIfNotExists, searchForExecutable } from "../../AUtils";
import { GenericDiffReporterBase } from "../GenericDiffReporterBase";

export default class CodiumReporter extends GenericDiffReporterBase {
  constructor() {
    super("codium");

    if (platform.isWindows) {
      this.exePath = searchForExecutable("codium.cmd");
    } else {
      this.exePath = searchForExecutable("codium");
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
