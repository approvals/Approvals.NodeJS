'use strict';

var fs = require('fs');
var chalk = require('chalk');
var jsdiff = require('diff');

var autils = require('../../AUtils');

class Reporter {

  constructor() {

    this.name = "nodediff";

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

    autils.createEmptyFileIfNotExists(approved);

    var approvedText = fs.readFileSync(approved).toString();
    var receivedText = fs.readFileSync(received).toString();

    console.log(`*******************************************`);
    console.log(`* Showing diff for ${approved} vs ${received}\n`);

    var diff = jsdiff.diffChars(approvedText, receivedText);

    diff.forEach(function (part) {
      // green for additions, red for deletions
      // grey for common parts
      var color = part.added ? 'green' :
        part.removed ? 'red' : 'gray';

      process.stdout.write(chalk[color](part.value));

    });

    console.log(`\n* End of diff for ${approved} vs ${received}`);
    console.log(`*******************************************\n\n`);

  }

}

module.exports = Reporter;
