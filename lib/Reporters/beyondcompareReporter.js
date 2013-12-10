var autils = require('../AUtils');
var GenericDiffReporterBase = require('./GenericDiffReporterBase');

var Reporter = function () {
    this.name = "BeyondCompare";
    this.exePath = autils.findWindowsExecutable("Beyond Compare 3", "BCompare.exe");
};

Reporter.prototype = new GenericDiffReporterBase();

module.exports = Reporter;
