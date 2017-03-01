'use strict';

var util = require('util');
var utils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

var Reporter = function () {
  this.name = "opendiff";
  this.exePath = utils.searchForExecutable("", "opendiff");
};

Reporter.prototype = new GenericDiffReporterBase();
util.inherits(Reporter, GenericDiffReporterBase);

module.exports = Reporter;
