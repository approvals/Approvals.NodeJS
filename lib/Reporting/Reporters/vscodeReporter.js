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

Reporter.prototype.report = function (approved, received, spawn) {
  spawn = spawn || child_process.spawn;
  autils.createEmptyFileIfNotExists(approved);

  var exe = this.exePath;

  spawn(exe, ["-n", "--diff", received, approved], {
    detached: true
  });

};

module.exports = Reporter;
