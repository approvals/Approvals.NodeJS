'use strict';

var child_process = require('child_process');
var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var ostools = require('../../osTools');

var Reporter = GenericDiffReporterBase.create(function () {
  this.name = "VisualStudio";

  if (ostools.platform.isWindows) {

    var edge = require('edge');

    // Use edge to execute some .net and go find the installed version of visual studio.
    var getVisualStudioPath = edge.func(function () {/*
      async (input) => {
        // pulled this from https://github.com/approvals/ApprovalTests.Net/blob/master/ApprovalTests/Reporters/VisualStudioReporter.cs
        return (string)Microsoft.Win32.Registry.GetValue(@"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\devenv.exe", "", @"Microsoft Visual Studio 11.0\Common7\IDE\devenv.exe");
      }
    */
    });
    this.exePath = getVisualStudioPath(null, true);
  }

});

Reporter.prototype.canReportOn = function (fileName) {

  if (ostools.platform.isWindows) {
    // todo: can we use "super" here now that we're using util.inherits?
    return GenericDiffReporterBase.prototype.canReportOn(fileName);
  }

  return false;
};

Reporter.prototype.report = function (approved, received, spawn) {
  spawn = spawn || child_process.spawn;
  autils.createEmptyFileIfNotExists(approved);

  var exe = this.exePath;

  var ps = spawn(exe, ["/diff", received, approved], {
    detached: true
  });

  ps.stdout.on('data', function (data) {
    console.log('reporter stdout: ' + data);
  });

  ps.stderr.on('data', function (data) {
    console.log('reporter stderr: ' + data);
  });

};

module.exports = Reporter;
