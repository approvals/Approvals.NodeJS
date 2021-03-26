var autils = require('../../AUtils');
var osTool = require('../../osTools');
var shelljs = require('shelljs');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

class Reporter extends GenericDiffReporterBase {

  constructor() {

    super("BeyondCompare");

    var app = null;
    if (osTool.platform.isMac) {
      try {
        app = shelljs.ls('/Applications/Beyond Compare.app/Contents/MacOS/bcomp')[0];
      } catch (err) {
        console.error(err);
      }
      app = app || autils.searchForExecutable("bcomp");
    } else if (osTool.platform.isWindows) {
      app = autils.searchForExecutable("Beyond Compare 4", "BCompare.exe")
        || autils.searchForExecutable("Beyond Compare 3", "BCompare.exe");
    }

    app = app || autils.searchForExecutable("bcomp");

    this.exePath = app;

  }

}

module.exports = Reporter;
