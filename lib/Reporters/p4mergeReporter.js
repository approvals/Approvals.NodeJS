var autils = require('../AUtils');
var GenericDiffReporterBase = require('./GenericDiffReporterBase');
var child_process = require('child_process');

var P4MergeReporter = function () {
	this.name = "P4Merge";
	this.exePath = autils.findWindowsExecutable("Perforce", "p4merge.exe");
};


P4MergeReporter.prototype = new GenericDiffReporterBase();

P4MergeReporter.prototype.report = function (approved, received, process) {
	process = process || child_process.spawn;
	autils.createEmptyFileIfNotExists(approved);

	process(this.exePath, [received, approved]);
};


module.exports = P4MergeReporter;
