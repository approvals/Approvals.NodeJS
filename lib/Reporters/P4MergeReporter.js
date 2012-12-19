var child_process = require('child_process');

var fs = require('fs');

var ensureFileExists = function (file) {
	if (!fs.existsSync(file)){
		fs.writeFileSync(file, "");
	}
}

var P4MergeReporter = function () {
}

P4MergeReporter.prototype.report = function (approved, received, process) {
	process = process || child_process.spawn;
	ensureFileExists(approved);
	process("C:\\Program Files\\Perforce\\p4merge.exe", [received, approved]);
}


module.exports = P4MergeReporter;
