'use strict';

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

class Reporter extends GenericDiffReporterBase {

  constructor() {

    super("icdiff");

    this.exePath = autils.searchForExecutable("", "icdiff");

  }

}

module.exports = Reporter;
