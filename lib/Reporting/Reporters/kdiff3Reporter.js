'use strict';

/**
 * Kdiff3 reporter (linux)
 */
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var child_process = require('child_process');

var Kdiff3Reporter = function () {
  this.name = "Kdiff3";
  this.exePath = autils.searchForExecutable("kdiff3");
};

Kdiff3Reporter.prototype = new GenericDiffReporterBase();

Kdiff3Reporter.prototype.report = function (approved, received, execCmd) {
  execCmd = execCmd || child_process.spawnSync;

  autils.createEmptyFileIfNotExists(approved);
  execCmd(this.exePath, [received,approved],{ stdio: 'inherit'});
};

module.exports = Kdiff3Reporter;
