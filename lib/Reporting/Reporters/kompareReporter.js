'use strict';

/**
 * kompare reporter (linux)
 */
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var child_process = require('child_process');

var KompareReporter = function () {
  this.name = "Kompare";
  this.exePath = autils.searchForExecutable("kompare");
};

KompareReporter.prototype = new GenericDiffReporterBase();

KompareReporter.prototype.report = function (approved, received, execCmd) {
  execCmd = execCmd || child_process.spawnSync;

  autils.createEmptyFileIfNotExists(approved);
  execCmd(this.exePath, [received, approved], { stdio: 'inherit' });
};

module.exports = KompareReporter;
