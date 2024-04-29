import {searchForExecutable} from "../../AUtils";

var osTool = require('../../osTools');
var shelljs = require('shelljs');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

class Reporter extends GenericDiffReporterBase {

  constructor() {

    super("BeyondCompare");

    var app:string = "";
    if (osTool.platform.isMac) {
      try {
        app = shelljs.ls('/Applications/Beyond Compare.app/Contents/MacOS/bcomp')[0];
      } catch (err) {
        console.error(err);
      }
      app = app || searchForExecutable("bcomp");
    } else if (osTool.platform.isWindows) {
      app = searchForExecutable("Beyond Compare 4", "BCompare.exe")
        || searchForExecutable("Beyond Compare 3", "BCompare.exe");
    }

    app = app || searchForExecutable("bcomp");

    this.exePath = app;

  }

}

module.exports = Reporter;
