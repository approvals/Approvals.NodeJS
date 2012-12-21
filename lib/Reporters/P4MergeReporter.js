var autils = require('../AUtils');
var child_process = require('child_process');

var P4MergeReporter = function () {
};

P4MergeReporter.prototype.report = function (approved, received, process) {
	process = process || child_process.spawn;
	autils.createEmptyFileIfNotExists(approved);
	process("C:\\Program Files\\Perforce\\p4merge.exe", [received, approved]);
};


module.exports = P4MergeReporter;
