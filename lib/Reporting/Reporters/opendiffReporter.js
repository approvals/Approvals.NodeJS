
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

class Reporter extends GenericDiffReporterBase {

  constructor() {
    super();

    this.name = "opendiff";
    this.exePath = autils.searchForExecutable("", "opendiff");

  }

}

module.exports = Reporter;
