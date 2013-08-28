var autils = require('../AUtils');
var GenericDiffReporterBase = require('./GenericDiffReporterBase');

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

module.exports = TortiseMergeReporter;
