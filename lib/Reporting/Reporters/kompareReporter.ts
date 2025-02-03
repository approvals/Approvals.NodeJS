import { searchForExecutable } from "../../AUtils";
import {GenericDiffReporterBase} from "../GenericDiffReporterBase";

export default class KompareReporter extends GenericDiffReporterBase {
  constructor() {
    super("Kompare");

    this.exePath = searchForExecutable("kompare");
  }
}
