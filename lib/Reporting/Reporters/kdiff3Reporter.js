'use strict';

/**
 * Kdiff3 reporter
 */

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

var Reporter = GenericDiffReporterBase.create(function () {
  this.name = "Kdiff3";
  this.exePath = autils.searchForExecutable("kdiff3");
});


module.exports = Reporter;
