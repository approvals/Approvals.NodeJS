'use strict';

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var Reporter = GenericDiffReporterBase.create(function () {
  this.name = "GitDiff";
  this.exePath = autils.searchForExecutable("Git/cmd", "git");
});

Reporter.prototype.report = function (approved, received, options) {

  options = options || {};

  autils.createEmptyFileIfNotExists(approved);
  console.log(this.exePath);

  options.cmdArgs = ['diff', '--no-index', '--', received, approved];

  return GenericDiffReporterBase.prototype.report.call(this, approved, received, options);

};

module.exports = Reporter;
