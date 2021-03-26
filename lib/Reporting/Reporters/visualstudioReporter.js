'use strict';

var autils = require('../../AUtils');
var GenericDiffReporterBase = require('../GenericDiffReporterBase');
var ostools = require('../../osTools');

class Reporter extends GenericDiffReporterBase {

  constructor() {

    super("VisualStudio");

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

  }

  canReportOn(fileName) {

    if (ostools.platform.isWindows) {
      return super.canReportOn(fileName);
    }

    return false;
  }

  report(approved, received) {

    const spawn = this.spawn;
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

  }
}

module.exports = Reporter;
