'use strict';

var util = require('util');
var child_process = require('child_process');
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

GenericDiffReporterBase.prototype.report = function (approved, received, spawn) {
  spawn = spawn || child_process.spawnSync;
  autils.createEmptyFileIfNotExists(approved);

  var exe = this.exePath;

  var cmdString = [exe, received, approved].join(' ');

  console.log('CMD: ' + cmdString);

  var result = spawn(exe, [received, approved], {
  });
  if (result.status !== 0) {
    throw new Error(
      "Could not launch diff tool: " +
      cmdString +
      "\n\n" +
      result.stderr.toString() +
      "\n\n" +
      result.stdout.toString()
    );
  }
};

module.exports = GenericDiffReporterBase;
