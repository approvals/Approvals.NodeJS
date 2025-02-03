import { createEmptyFileIfNotExists, searchForExecutable } from "../../AUtils";
import { Config } from "../../config";
import {GenericDiffReporterBase} from "../GenericDiffReporterBase";

export default class GitDiffReporter extends GenericDiffReporterBase {
  constructor() {
    super("GitDiff");

    this.exePath = searchForExecutable("Git/cmd", "git");
  }

  report(approved: string, received: string, options?: Partial<Config>) {
    options = options || {};

    createEmptyFileIfNotExists(approved);
    console.log(this.exePath);

    options.cmdArgs = ["diff", "--no-index", "--", received, approved];

    // force gitdiff to run synchronously so our console output
    // stays in order of test execution.
    const newOptions = Object.assign({}, options, {
      blockUntilReporterExits: true,
    });

    return super.report(approved, received, newOptions);
  }
}
