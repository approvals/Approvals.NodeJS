'use strict';

var util = require('util');
var fs = require('fs');
var chalk = require('chalk');
var jsdiff = require('diff');

var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var autils = require('../../AUtils');

var Reporter = function () {
  this.name = "nodediff";
};

util.inherits(Reporter, GenericDiffReporterBase);

Reporter.prototype.canReportOn = function (fileName) {

  autils.assertFileExists(fileName);

  var isBinary = autils.isBinaryFile(fileName);
  if (isBinary) {
    return false;
  }

  return true;
};

Reporter.prototype.report = function (approved, received) {

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

};

module.exports = Reporter;
