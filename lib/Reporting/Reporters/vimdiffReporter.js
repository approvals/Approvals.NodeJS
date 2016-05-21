'use strict';

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var child_process = require('child_process');

var VimDiffReporter = function () {
  this.name = "VimDiff";
  this.exePath = autils.searchForExecutable("vim");
};

VimDiffReporter.prototype = new GenericDiffReporterBase();

VimDiffReporter.prototype.report = function (approved, received, execCmd) {
  execCmd = execCmd || child_process.spawnSync;

  autils.createEmptyFileIfNotExists(approved);
  execCmd(this.exePath, ['-d',received,approved],{ stdio: 'inherit'});
};

module.exports = VimDiffReporter;
