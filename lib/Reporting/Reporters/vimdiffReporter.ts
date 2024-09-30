import GenericDiffReporterBase from "../GenericDiffReporterBase";
import { createEmptyFileIfNotExists, searchForExecutable } from "../../AUtils";

export default class Reporter extends GenericDiffReporterBase {
  constructor() {
    super("VimDiff");

    // options.cmdOptions = {
    //   stdio: "inherit",
    // };

    this.exePath = searchForExecutable("vim");
    this.setCommandArgs = (approved, received) => {
      return ["-d", received, approved];
    };
  }
}
