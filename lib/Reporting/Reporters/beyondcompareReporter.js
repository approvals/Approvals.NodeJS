var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

module.exports = GenericDiffReporterBase.create(function () {
  this.name = "BeyondCompare";
  this.exePath = autils.searchForExecutable("Beyond Compare 3", "BCompare.exe");
});
