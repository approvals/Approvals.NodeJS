import {GenericDiffReporterBase} from "../GenericDiffReporterBase";
import { searchForExecutable } from "../../AUtils";

export default class Kdiff3Reporter extends GenericDiffReporterBase {
  constructor() {
    super("Kdiff3");

    this.exePath = searchForExecutable("kdiff3");
  }
}
