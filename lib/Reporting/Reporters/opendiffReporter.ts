import {searchForExecutable} from "../../AUtils";
import GenericDiffReporterBase from "../GenericDiffReporterBase";


export default class OpenDiffReporter extends GenericDiffReporterBase {

  constructor() {

    super("opendiff");

    this.exePath = searchForExecutable("", "opendiff");

  }

}
