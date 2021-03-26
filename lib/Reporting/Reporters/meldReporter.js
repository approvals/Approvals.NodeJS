'use strict';

/**
 * Meld reporter (linux)
 */
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

class Reporter extends GenericDiffReporterBase {

  constructor() {

    super("Meld");

    this.exePath = autils.searchForExecutable("meld");

  }

}

module.exports = Reporter;
