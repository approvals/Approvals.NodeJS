'use strict';

var expect = require("chai").expect;
var path = require("path");
var ReporterUnderTest = require("../../../lib/Reporting/Reporters/vimdiffReporter.js");

describe('Reporter', function () {
  describe('vimdiff', function () {
    it('reporter args are correct', function () {

      var reporter = new ReporterUnderTest();

      var approved = path.join(__dirname, "a.txt");
      var received = path.join(__dirname, "b.txt");

      reporter.report(approved, received, function (command,arglist) {
        var pathTrimmedCommand = command
          .replace("vim.cmd", "vim")
          .replace(/(.*)Program Files(.*)vim.exe/g, 'vim') // try to adjust for windows commands
          .replace("vim.exe", "vim")
          .toLowerCase();
        var startTrim = pathTrimmedCommand.indexOf("vim");
        pathTrimmedCommand =  pathTrimmedCommand.substr(startTrim);
        expect(pathTrimmedCommand).to.equal("vim");
        expect(arglist).to.deep.equal(['-d',received,approved]);
        return {};
      });
    });

  });
});
