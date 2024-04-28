import {searchForExecutable} from '../../AUtils';
import {platform} from '../../osTools';
import * as shelljs from 'shelljs';
import GenericDiffReporterBase from '../GenericDiffReporterBase';

class Reporter extends GenericDiffReporterBase {
    constructor() {
        super("BeyondCompare");

        let app: string | null = null;
        if (platform.isMac) {
            try {
                const results = shelljs.ls('/Applications/Beyond Compare.app/Contents/MacOS/bcomp');
                app = results[0];
            } catch (err) {
                console.error(err);
            }
            app = app || autils.searchForExecutable("bcomp");
        } else if (platform.isWindows) {
            app = searchForExecutable("Beyond Compare 4", "BCompare.exe")
                || searchForExecutable("Beyond Compare 3", "BCompare.exe");
        }

        app = app || searchForExecutable("bcomp");

        this.exePath = app;
    }
}

module.exports = Reporter;
