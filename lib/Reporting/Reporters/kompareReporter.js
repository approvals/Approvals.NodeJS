'use strict';

/**
 * kompare reporter
 */

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

module.exports = GenericDiffReporterBase.create(function () {
  this.name = "Kompare";
  this.exePath = autils.searchForExecutable("kompare");
});
