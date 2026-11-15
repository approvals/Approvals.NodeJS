import { searchForExecutable } from "../../AUtils";
import { GenericDiffReporterBase } from "../GenericDiffReporterBase";

export default class Kdiff3Reporter extends GenericDiffReporterBase {
  constructor() {
    super("Kdiff3");

    this.exePath = searchForExecutable("kdiff3");
  }
}
