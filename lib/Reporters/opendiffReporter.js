var utils = require('../AUtils');
var GenericDiffReporterBase = require('./GenericDiffReporterBase');

var OpenDiffReporter = function () {
  this.name = "opendiff";
  this.exePath = utils.searchForExecutable("", "opendiff");
};

OpenDiffReporter.prototype = new GenericDiffReporterBase();

module.exports = OpenDiffReporter;
