import { searchForExecutable } from "../../AUtils";
import { GenericDiffReporterBase } from "../GenericDiffReporterBase";

export default class Reporter extends GenericDiffReporterBase {
  constructor() {
    super("VimDiff");

    this.exePath = searchForExecutable("vim");
    this.setCommandArgs = (approved, received) => {
      return ["-d", received, approved];
    };
    this.modifyCommandOptions = (cmdOptions) => {
      if (!cmdOptions) {
        cmdOptions = {};
      }

      cmdOptions.stdio = "inherit";
      return cmdOptions;
    };
  }
}
