import GenericDiffReporterBase from "../GenericDiffReporterBase";
import {createEmptyFileIfNotExists, searchForExecutable} from "../../AUtils";


export default class Reporter extends GenericDiffReporterBase {

  constructor() {

    super("VimDiff");

    this.exePath = searchForExecutable("vim");

  }

  report(approved, received, options) {

    options = options || {};
    options.cmdArgs = ['-d', received, approved];

    options.cmdOptions = {
      stdio: 'inherit'
    };

    createEmptyFileIfNotExists(approved);

    return super.report(approved, received, options);

  }

}
