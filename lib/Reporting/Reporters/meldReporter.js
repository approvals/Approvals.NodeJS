'use strict';

/**
 * Meld reporter (linux)
 */
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var child_process = require('child_process');

var MeldReporter = function () {
  this.name = "Meld";
  this.exePath = autils.searchForExecutable("meld");
};

MeldReporter.prototype = new GenericDiffReporterBase();

MeldReporter.prototype.report = function (approved, received, execCmd) {
  execCmd = execCmd || child_process.spawnSync;

  autils.createEmptyFileIfNotExists(approved);
  execCmd(this.exePath, [received,approved],{ stdio: 'inherit'});
};

module.exports = MeldReporter;
