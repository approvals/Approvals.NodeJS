
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

module.exports = GenericDiffReporterBase.create(function () {
  this.name = "opendiff";
  this.exePath = autils.searchForExecutable("", "opendiff");
});
