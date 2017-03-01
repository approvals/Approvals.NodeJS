'use strict';

/**
 * kompare reporter (linux)
 */
var util = require('util');
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var child_process = require('child_process');

var Reporter = function () {
  this.name = "Kompare";
  this.exePath = autils.searchForExecutable("kompare");
};

util.inherits(Reporter, GenericDiffReporterBase);

Reporter.prototype.report = function (approved, received, execCmd) {
  execCmd = execCmd || child_process.spawnSync;

  autils.createEmptyFileIfNotExists(approved);
  execCmd(this.exePath, [received, approved], { stdio: 'inherit' });
};

module.exports = Reporter;
