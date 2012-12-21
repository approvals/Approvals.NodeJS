var autils = require('../AUtils');
var GenericDiffReporterBase = require('./GenericDiffReporterBase');
var shell = require("shelljs");

var GitDiffReporter = function () {
	this.name = "GitDiff";
};

GitDiffReporter.prototype = new GenericDiffReporterBase();

GitDiffReporter.prototype.report = function (approved, received, execCmd) {
	execCmd = execCmd || shell.exec;

	autils.createEmptyFileIfNotExists(approved);

	var cmd = "git diff --no-index -- " + received + " " + approved;
	var result = execCmd(cmd).output;
	if (result) {
		throw result;
	}
	else {
		// No diff and all's well!
	}
};


module.exports = GitDiffReporter;
