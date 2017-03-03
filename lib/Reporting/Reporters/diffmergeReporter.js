'use strict';

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var shelljs = require('shelljs');
var osTools = require('../../osTools');

module.exports = GenericDiffReporterBase.create(function () {
  this.name = "DiffMerge";

  var app = null;
  if (osTools.platform.isMac) {
    try {
      app = shelljs.ls('/Applications/DiffMerge.app/Contents/MacOS/DiffMerge')[0];
    } catch (err) {
      console.error(err);
    }
  }

  this.exePath = app || autils.searchForExecutable("DiffMerge");
});
