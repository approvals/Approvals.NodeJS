'use strict';

var fs = require('fs');
var chalk = require('chalk');
var jsdiff = require('diff');

var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var autils = require('../../AUtils');

class Reporter extends GenericDiffReporterBase {

  constructor() {

    super("nodediff");

  }


  canReportOn(fileName) {

    autils.assertFileExists(fileName);

    var isBinary = autils.isBinaryFile(fileName);
    if (isBinary) {
      return false;
    }

    return true;
  }

  report(approved, received) {

    var approvedText = fs.readFileSync(approved).toString();
    var receivedText = fs.readFileSync(received).toString();

    var diff = jsdiff.diffChars(approvedText, receivedText);

    diff.forEach(function (part) {
      // green for additions, red for deletions
      // grey for common parts
      var color = part.added ? 'green' :
        part.removed ? 'red' : 'gray';

      process.stderr.write(chalk[color](part.value));
    });

  }

}

module.exports = Reporter;
