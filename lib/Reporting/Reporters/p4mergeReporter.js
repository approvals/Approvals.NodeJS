'use strict';

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var shelljs = require('shelljs');
var fs = require('fs');
var osTools = require('../../osTools');

class Reporter extends GenericDiffReporterBase {

  constructor() {

    super("P4Merge");

    var app = null;
    if (osTools.platform.isMac) {

      try {
        app = shelljs.ls('/Applications/p4merge.app/Contents/Resources/launchp4merge')[0];
      } catch (err) {
        console.error(err);
      }

      try {
        // `shelljs.find` will `process.exit` on error - so test the folder exists first
        if (fs.existsSync('/opt/homebrew-cask/Caskroom/p4merge')) {
          app = app || shelljs.find('/opt/homebrew-cask/Caskroom/p4merge').filter(function (item){
            return item.indexOf('launchp4merge') >= 0;
          })[0];
        }
      } catch (err) {
        //console.error(err);
      }
    }

    this.exePath = app || autils.searchForExecutable("Perforce", "p4merge.exe");

  }

}

module.exports = Reporter;
