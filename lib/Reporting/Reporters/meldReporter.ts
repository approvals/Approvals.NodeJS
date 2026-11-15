import { searchForExecutable } from "../../AUtils";
import { GenericDiffReporterBase } from "../GenericDiffReporterBase";

export default class MeldReporter extends GenericDiffReporterBase {
  constructor() {
    super("Meld");

    this.exePath = searchForExecutable("meld");
  }
}
