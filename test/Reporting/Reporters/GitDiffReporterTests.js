'use strict';

//git diff --no-index -- test\Reporters\a.txt test\Reporters\b.txt

var expect = require("chai").expect;
var path = require("path");
var ReporterUnderTest = require("../../../lib/Reporting/Reporters/gitdiffReporter.js");

describe('Reporter', function () {
  describe('git diff', function () {
    it('reporter args are correct', function () {

      var reporter = new ReporterUnderTest();

      var approved = path.join(__dirname, "a.txt");
      var received = path.join(__dirname, "b.txt");

      reporter.report(approved, received, {
        spawn: function (exe, args) {

          expect(args).to.deep.equal([
            'diff',
            '--no-index',
            '--',
            received,
            approved
          ]);

          return {
            status: 0 // success
          };
        }
      });

    });

  });
});
