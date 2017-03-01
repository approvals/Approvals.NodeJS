'use strict';

var util = require('util');
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var shell = require("shelljs");

var Reporter = function () {
  this.name = "GitDiff";
  this.exePath = autils.searchForExecutable("Git/cmd", "git");
};

util.inherits(Reporter, GenericDiffReporterBase);

Reporter.prototype.report = function (approved, received, execCmd) {
  execCmd = execCmd || shell.exec;

  autils.createEmptyFileIfNotExists(approved);
  console.log(this.exePath);
  var cmd = "'" + this.exePath + "' diff --no-index -- '" + received + "' '" + approved + "'";
  var result = execCmd(cmd).output;
  if (result) {
    throw result;
  }
};

module.exports = Reporter;
