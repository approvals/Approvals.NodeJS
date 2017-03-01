'use strict';

var util = require('util');
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

var P4MergeReporter = function () {
  this.name = "P4Merge";
  this.exePath = autils.searchForExecutable("Perforce", "p4merge.exe");
};
util.inherits(P4MergeReporter, GenericDiffReporterBase);

module.exports = P4MergeReporter;
