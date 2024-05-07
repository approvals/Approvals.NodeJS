import GenericDiffReporterBase from "../GenericDiffReporterBase";
import {platform} from "../../osTools";
import {searchForExecutable} from "../../AUtils";

 export default class CodiumReporter extends GenericDiffReporterBase {
    constructor() {
        super("codium");

        if (platform.isWindows) {
            this.exePath = searchForExecutable("codium.cmd");
        } else {
            this.exePath = searchForExecutable("codium");
        }
    }

    report(approved, received, options) {
        autils.createEmptyFileIfNotExists(approved);

        options.cmdArgs = ["-n", "--diff", received, approved];
        options.cmdOptionOverrides = {
            detached: true,
        };

        return super.report(approved, received, options);
    }
}
