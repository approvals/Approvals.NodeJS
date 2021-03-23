'use strict';


var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

var Reporter = GenericDiffReporterBase.create(function () {
  this.name = "VimDiff";
  this.exePath = autils.searchForExecutable("vim");
});

Reporter.prototype.report = function (approved, received, options) {

  options = options || {};
  options.cmdArgs = ['-d', received, approved];

  autils.createEmptyFileIfNotExists(approved);

  return GenericDiffReporterBase.prototype.report.call(this, approved, received, options);

};

module.exports = Reporter;
