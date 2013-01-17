var autils = require('../AUtils');
var GenericDiffReporterBase = require('./GenericDiffReporterBase');

var P4MergeReporter = function () {
	this.name = "P4Merge";
	this.exePath = autils.findWindowsExecutable("Perforce", "p4merge.exe");
};


P4MergeReporter.prototype = new GenericDiffReporterBase();

module.exports = P4MergeReporter;
