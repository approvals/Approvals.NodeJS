var autils = require('../AUtils');
var GenericDiffReporterBase = require('./GenericDiffReporterBase');
var child_process = require('child_process');

var TortiseMergeReporter = function () {
	this.name = "TortiseMerge";
	this.exePath = autils.findWindowsExecutable("TortoiseGit/bin", "TortoiseMerge.exe");
};

TortiseMergeReporter.prototype = new GenericDiffReporterBase();

TortiseMergeReporter.prototype.report = function (approved, received, process) {
	process = process || child_process.spawn;
	autils.createEmptyFileIfNotExists(approved);
	process(this.exePath, [received, approved]);
};


module.exports = TortiseMergeReporter;
