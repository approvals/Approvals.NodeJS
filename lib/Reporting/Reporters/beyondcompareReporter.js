'use strict';

var util = require('util');
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

var Reporter = function () {
  this.name = "BeyondCompare";
  this.exePath = autils.searchForExecutable("Beyond Compare 3", "BCompare.exe");
};

util.inherits(Reporter, GenericDiffReporterBase);

module.exports = Reporter;
