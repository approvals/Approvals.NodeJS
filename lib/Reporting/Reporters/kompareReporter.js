'use strict';

/**
 * kompare reporter
 */

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

class Reporter extends GenericDiffReporterBase {

  constructor() {

    super("Kompare");

    this.exePath = autils.searchForExecutable("kompare");

  }

}

module.exports = Reporter;
