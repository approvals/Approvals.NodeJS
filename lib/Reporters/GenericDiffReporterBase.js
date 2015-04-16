var child_process = require('child_process');
var autils = require('../AUtils');
var fs = require('fs');

var GenericDiffReporterBase = function () { };

GenericDiffReporterBase.prototype.canReportOn = function (fileName) {

  autils.assertFileExists(fileName);

  if (!fs.existsSync(this.exePath)) {
    return false;
  }

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

  console.log('CMD: ' + [exe, received, approved].join(' '));

  spawn(exe, [received, approved], {
    detached: true,
    stdio: ['pipe', 1, 2, 'ipc']
  });
};

module.exports = GenericDiffReporterBase;
