var isWindows = (process.platform.indexOf('win') === 0);

exports.platform = {
  isWindows: isWindows
};

var findProgramPathCommand = "which";

if (isWindows) {
  findProgramPathCommand = "where";
}

exports.findProgramPathCommand = findProgramPathCommand;
