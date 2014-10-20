var autils = require('../AUtils');
var GenericDiffReporterBase = require('./GenericDiffReporterBase');
var shell = require("shelljs");

var GitDiffReporter = function () {
    this.name = "GitDiff";
    this.exePath = autils.searchForExecutable("Git/cmd", "git");
};

GitDiffReporter.prototype = new GenericDiffReporterBase();

GitDiffReporter.prototype.report = function (approved, received, execCmd) {
    execCmd = execCmd || shell.exec;

    autils.createEmptyFileIfNotExists(approved);
    console.log(this.exePath);
    var cmd = "'" + this.exePath + "' diff --no-index -- '" + received + "' '" + approved + "'";
    var result = execCmd(cmd).output;
    if (result) {
        throw result;
    }
    else {
        // No diff and all's well!
    }
};


module.exports = GitDiffReporter;
