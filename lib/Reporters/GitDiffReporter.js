var autils = require('../AUtils');
var child_process = require('child_process');


var GitDiffReporter = function () {
};

GitDiffReporter.prototype.report = function (approved, received, done, spawn) {
	spawn = spawn || child_process.spawn;

	autils.createEmptyFileIfNotExists(approved);

	var cmd = "git diff --no-index --" + received + " " + approved;
	result = require('subprocess').command(cmd);
	throw result;

	var spawnedProcess = spawn("cmd", ["git", "diff", "--no-index", "--", received, approved]);
	if (spawnedProcess && spawnedProcess.stdout) {
		spawnedProcess.stdout.pipe(process.stdout);
	}
};


module.exports = GitDiffReporter;
