'use strict';

/**
 * Meld reporter (linux)
 */
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

module.exports = GenericDiffReporterBase.create(function () {
  this.name = "Meld";
  this.exePath = autils.searchForExecutable("meld");
});
