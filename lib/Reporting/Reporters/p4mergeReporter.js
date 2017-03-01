'use strict';

var util = require('util');
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

var Reporter = function () {
  this.name = "P4Merge";
  this.exePath = autils.searchForExecutable("Perforce", "p4merge.exe");
};
util.inherits(Reporter, GenericDiffReporterBase);

module.exports = Reporter;
