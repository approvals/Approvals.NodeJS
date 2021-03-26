'use strict';

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

module.exports = GenericDiffReporterBase.create(function () {
  this.name = "icdiff";
  this.exePath = autils.searchForExecutable("", "icdiff");
});
