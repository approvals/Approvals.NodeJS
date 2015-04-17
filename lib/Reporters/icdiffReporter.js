var autils = require('../AUtils');
var GenericDiffReporterBase = require('./GenericDiffReporterBase');
var shell = require("shelljs");

var IcdiffReporter = function () {
  this.name = "icdiff";
  this.exePath = autils.searchForExecutable("", "icdiff");
};

IcdiffReporter.prototype = new GenericDiffReporterBase();

IcdiffReporter.prototype.report = function (approved, received, execCmd) {
  execCmd = execCmd || shell.exec;

  autils.createEmptyFileIfNotExists(approved);
  console.log(this.exePath);
  var cmd = "'" + this.exePath + "' '" + received + "' '" + approved + "'";
  console.log('cmd:',cmd);
  var result = execCmd(cmd).output;
  if (result) {
    throw result;
  }
};

module.exports = IcdiffReporter;
