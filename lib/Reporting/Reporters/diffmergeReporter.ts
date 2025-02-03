import * as shelljs from "shelljs";
import { platform } from "../../osTools";
import { searchForExecutable } from "../../AUtils";
import {GenericDiffReporterBase} from "../GenericDiffReporterBase";

class Reporter extends GenericDiffReporterBase {
  constructor() {
    super("DiffMerge");

    let app: string | null = null;
    if (platform.isMac) {
      try {
        app = shelljs.ls(
          "/Applications/DiffMerge.app/Contents/MacOS/DiffMerge",
        )[0];
      } catch (err) {
        console.error(err);
      }
    }

    this.exePath = app || searchForExecutable("DiffMerge");
  }
}

export = Reporter;
