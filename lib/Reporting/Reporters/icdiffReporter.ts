import { searchForExecutable } from "../../AUtils";
import {GenericDiffReporterBase} from "../GenericDiffReporterBase";

export default class IcDiffReporter extends GenericDiffReporterBase {
  constructor() {
    super("icdiff");

    this.exePath = searchForExecutable("", "icdiff");
  }
}
