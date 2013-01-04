exports.platform = {
	isWindows: (process.platform.indexOf('win') === 0)
};

var findProgramPathCommand = "which";


if (process.platform.indexOf('win') === 0) {
	findProgramPathCommand = "where";
}

exports.findProgramPathCommand = findProgramPathCommand;
