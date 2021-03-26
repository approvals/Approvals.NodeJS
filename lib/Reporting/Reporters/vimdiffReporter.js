'use strict';


var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

class Reporter extends GenericDiffReporterBase {

  constructor() {

    super("VimDiff");

    this.exePath = autils.searchForExecutable("vim");

  }

  report(approved, received, options) {

    options = options || {};
    options.cmdArgs = ['-d', received, approved];

    options.cmdOptions = {
      stdio: 'inherit'
    };

    autils.createEmptyFileIfNotExists(approved);

    return super.report(approved, received, options);

  }

}

module.exports = Reporter;
