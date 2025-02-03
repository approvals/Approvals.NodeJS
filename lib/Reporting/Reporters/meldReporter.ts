import {GenericDiffReporterBase} from "../GenericDiffReporterBase";
import { searchForExecutable } from "../../AUtils";

export default class MeldReporter extends GenericDiffReporterBase {
  constructor() {
    super("Meld");

    this.exePath = searchForExecutable("meld");
  }
}
