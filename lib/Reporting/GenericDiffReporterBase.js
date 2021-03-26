'use strict';

var util = require('util');
var childProcess = require('child_process');
var autils = require('../AUtils');
var fs = require('fs');

var GenericDiffReporterBase = function () {
  this._reporterFileLookedUp = false;
  this._reporterFileLookedUpAndFound = false;
};

GenericDiffReporterBase.create = function (ReporterConstructor) {
  util.inherits(ReporterConstructor, GenericDiffReporterBase);
  return ReporterConstructor;
};

GenericDiffReporterBase.prototype.isReporterAvailable = function () {

  if (this._reporterFileLookedUp) {
    return this._reporterFileLookedUpAndFound;
  }

  this._reporterFileLookedUp = true;

  if (!fs.existsSync(this.exePath)) {
    return false;
  }
  this._reporterFileLookedUpAndFound = true;
  return true;
}

// override this if a specific image reporte can support images
GenericDiffReporterBase.prototype.canImageDiff = function () {
  return false;
}

GenericDiffReporterBase.prototype.canReportOn = function (fileName) {

  if (!this.isReporterAvailable()) {
    return false;
  }

  autils.assertFileExists(fileName);

  if (this.canImageDiff()) {
    return true;
  }

  var isBinary = autils.isBinaryFile(fileName);
  if (isBinary) {
    return false;
  }

  return true;
};

GenericDiffReporterBase.prototype.spawn = function (exe, args, cmdOptions) {
  return childProcess.spawn(exe, args, cmdOptions);
}

GenericDiffReporterBase.prototype.spawnSync = function (exe, args, cmdOptions) {
  return childProcess.spawnSync(exe, args, cmdOptions);
}

GenericDiffReporterBase.prototype.report = function (approved, received, options) {

  const spawn = (options.blockUntilReporterExits ? this.spawnSync : this.spawn);
  autils.createEmptyFileIfNotExists(approved);

  var exe = this.exePath;
  var cmdOptions = options.cmdOptionOverrides;
  var args = options.cmdArgs || [received, approved];

  var cmdString = options.cmdString || [exe, args.join(' ')].join(' ');

  console.log('CMD: ', exe, args.join(' '));

  var result = spawn(exe, args, cmdOptions);

  if (result.status !== 0) {

    const stdOut = result.stdout ? ('\n\n============\nstd err:\n============\n' + result.stdout.toString() + "\n============\n") : '';
    const stdErr = result.stderr ? ('\n============\nstd out:\n============\n' + result.stderr.toString() + "\n============\n") : '';

    throw new Error(
      "Could not launch diff tool with command:\n\n" +
      "CMD> " + cmdString +
      stdOut +
      stdErr
    );
  }
};

module.exports = GenericDiffReporterBase;
