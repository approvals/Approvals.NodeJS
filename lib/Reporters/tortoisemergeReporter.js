var autils = require('../AUtils');
var GenericDiffReporterBase = require('./GenericDiffReporterBase');

var TortoiseMergeReporter = function () {
    this.name = "TortoiseMerge";

    var rootPaths = [
        "TortoiseGit/bin",
        "TortoiseSVN/bin",
    ];
    var path = null;
    for (var i = 0; i < rootPaths.length; i++) {
        path = autils.searchForExecutable(rootPaths[i], "TortoiseMerge.exe");
        if (path) break;
    }
    this.exePath = path;
};

TortoiseMergeReporter.prototype = new GenericDiffReporterBase();

module.exports = TortoiseMergeReporter;
