var child_process = require('child_process');
var autils = require('../AUtils');
var fs = require('fs');

var GenericDiffReporterBase = function () { };

GenericDiffReporterBase.prototype.canReportOn = function (fileName) {

    autils.assertFileExists(fileName);

    if (!fs.existsSync(this.exePath)) return false;

    var isBinary = autils.isBinaryFile(fileName);
    if (isBinary) {
        return false;
    }

    return true;
};

GenericDiffReporterBase.prototype.report = function (approved, received, spawn) {
    spawn = spawn || child_process.spawn;
    autils.createEmptyFileIfNotExists(approved);

    var exe = this.exePath;

    var ps = spawn(exe, [received, approved], {
        detached: true
    });

    ps.stdout.on('data', function (data) {
        console.log('reporter stdout: ' + data);
    });

    ps.stderr.on('data', function (data) {
        console.log('reporter stderr: ' + data);
    });
};

module.exports = GenericDiffReporterBase;
