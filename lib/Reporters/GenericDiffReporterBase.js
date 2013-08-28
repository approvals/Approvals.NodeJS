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

GenericDiffReporterBase.prototype.report = function (approved, received, process) {
    process = process || child_process.spawn;
    autils.createEmptyFileIfNotExists(approved);

    process(this.exePath, [received, approved]);

};

module.exports = GenericDiffReporterBase;
