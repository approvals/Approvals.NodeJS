'use strict';

var util = require('util');
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');

var Reporter = function () {
  this.name = "TortoiseMerge";

  var rootPaths = [
    "TortoiseGit/bin",
    "TortoiseSVN/bin"
  ];
  var exeNames = [
    'TortoiseGitMerge.exe',
    'TortoiseMerge.exe'
  ];
  var path = null;

  for (var i = 0; i < rootPaths.length; i++) {
    for (var j = 0; j < exeNames.length; j++) {
      path = autils.searchForExecutable(rootPaths[i], exeNames[j]);
      if (path) {
        break;
      }
    }
    if (path) {
      break;
    }
  }
  this.exePath = path;
};

util.inherits(Reporter, GenericDiffReporterBase);

module.exports = Reporter;
