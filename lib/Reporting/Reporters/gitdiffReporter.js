'use strict';

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

class Reporter extends GenericDiffReporterBase {

  constructor() {
    super();

    this.name = "GitDiff";
    this.exePath = autils.searchForExecutable("Git/cmd", "git");

  }

  report(approved, received, options) {

    options = options || {};

    autils.createEmptyFileIfNotExists(approved);
    console.log(this.exePath);

    options.cmdArgs = ['diff', '--no-index', '--', received, approved];

    return super.report(approved, received, options);

  }

}

module.exports = Reporter;
