var autils = require('../AUtils');
var GenericDiffReporterBase = require('./GenericDiffReporterBase');
var child_process = require('child_process');

var TortiseMergeReporter = function () {
  this.name = "TortiseMerge";

  var rootPaths = [
    "TortoiseGit/bin",
    "TortoiseSVN/bin",
  ];
  var path = null;
  for (var i = 0; i < rootPaths.length; i++) {
    path = autils.findWindowsExecutable(rootPaths[i], "TortoiseMerge.exe");
    if (path) break;
  }
  this.exePath = path;
};

TortiseMergeReporter.prototype = new GenericDiffReporterBase();

TortiseMergeReporter.prototype.report = function (approved, received, process) {
  process = process || child_process.spawn;
  autils.createEmptyFileIfNotExists(approved);
  process(this.exePath, [received, approved]);
};


module.exports = TortiseMergeReporter;
