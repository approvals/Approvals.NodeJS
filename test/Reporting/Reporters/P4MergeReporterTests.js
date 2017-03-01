'use strict';

var assert = require("assert");
var path = require("path");
var ReporterUnderTest = require("../../../lib/Reporting/Reporters/p4mergeReporter.js");
//var sinon = require('sinon');

describe('Reporter', function () {

  // it("sample p4merge real test", function () {
  //   var approvals = require('../../../lib/Approvals');
  //   approvals.verify(__dirname, 'p4mergeTempTest', 'some test data', {
  //     reporters: [
  //       'p4merge'
  //     ]
  //   });
  // });

  describe('p4merge', function () {
    it.skip('reporter args are correct', function () {
      this.timeout(60000); // test runs slow on appveyor?
      var reporter = new ReporterUnderTest();

      var approvedFile = path.join(__dirname, "a.txt");
      var receivedFile = path.join(__dirname, "b.txt");

      if (reporter.canReportOn(receivedFile)) {
        reporter.report(approvedFile, receivedFile, function (command, args) {

          assert.equal(command.toLowerCase(), "c:/program files/perforce/p4merge.exe");
          assert.deepEqual(args, [receivedFile, approvedFile]);

          return {
            stdout: { on: function () { } },
            stderr: { on: function () { } }
          };

        });
      }

    });

    describe('p4merge searchForExecutable', function () {

      describe('on windows', function () {
        it('should find it in Program Files');
        it('should find it in Program Files (x86)');
      });

      describe('on mac', function () {
        it('should find it in /Applications/p4merge.app/Contents/Resources/launchp4merge');
        it('should find it in /opt/homebrew-cask/Caskroom/p4merge/2014.3-1007540/p4merge.app/Contents/Resources/launchp4merge');
      });
    });
  });

});
