'use strict';

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var shelljs = require('shelljs');
var osTools = require('../../osTools');

class Reporter extends GenericDiffReporterBase {

  constructor() {

    super("DiffMerge");

    var app = null;
    if (osTools.platform.isMac) {
      try {
        app = shelljs.ls('/Applications/DiffMerge.app/Contents/MacOS/DiffMerge')[0];
      } catch (err) {
        console.error(err);
      }
    }

    this.exePath = app || autils.searchForExecutable("DiffMerge");

  }

}

module.exports = Reporter;
