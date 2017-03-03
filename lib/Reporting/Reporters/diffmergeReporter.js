'use strict';

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var shelljs = require('shelljs');

module.exports = GenericDiffReporterBase.create(function () {
  this.name = "DiffMerge";

  var isMac = process.platform === 'darwin';
  var app = null;
  if (isMac) {
    try {
      app = shelljs.ls('/Applications/DiffMerge.app/Contents/MacOS/DiffMerge')[0];
    } catch (err) {
      console.error(err);
    }
  }

  this.exePath = app || autils.searchForExecutable("DiffMerge");
});
