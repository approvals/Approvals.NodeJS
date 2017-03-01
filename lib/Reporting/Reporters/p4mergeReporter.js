'use strict';

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var shelljs = require('shelljs');

module.exports = GenericDiffReporterBase.create(function () {
  this.name = "P4Merge";

  var isMac = process.platform === 'darwin';
  var app = null;
  if (isMac) {
    app = shelljs.ls('/Applications/p4merge.app/Contents/Resources/launchp4merge')[0];
    app = app || shelljs.find('/opt/homebrew-cask/Caskroom/p4merge').filter(function (item){
      return item.indexOf('launchp4merge') >= 0;
    })[0];
  }
  this.exePath = app || autils.searchForExecutable("Perforce", "p4merge.exe");
});
