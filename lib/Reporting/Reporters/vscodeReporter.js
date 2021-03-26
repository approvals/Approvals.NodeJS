'use strict';

var child_process = require('child_process');
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var ostools = require('../../osTools');

var Reporter = GenericDiffReporterBase.create(function () {

  this.name = "vscode";

  if (ostools.platform.isWindows) {
    this.exePath = autils.searchForExecutable('code.cmd');
  } else {
    this.exePath = autils.searchForExecutable('code');
  }

});

Reporter.prototype.report = function (approved, received, options) {

  autils.createEmptyFileIfNotExists(approved);

  options.cmdArgs = ['-n', '--diff', received, approved];
  options.cmdOptionOverrides = {
    detached: true
  };

  return GenericDiffReporterBase.prototype.report.call(this, approved, received, options);

};

module.exports = Reporter;
