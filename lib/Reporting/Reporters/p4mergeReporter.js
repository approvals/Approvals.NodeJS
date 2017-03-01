'use strict';

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

module.exports = GenericDiffReporterBase.create(function () {
  this.name = "P4Merge";
  this.exePath = autils.searchForExecutable("Perforce", "p4merge.exe");
});
