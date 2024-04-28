'use strict';

var expect = require("chai").expect;
var path = require("path");
var ReporterUnderTest = require("../../../lib/Reporting/Reporters/vimdiffReporter");

describe('Reporter', function () {
  describe('vimdiff', function () {
    it('reporter args are correct', function () {

      var reporter = new ReporterUnderTest();

      var approved = path.join(__dirname, "a.txt");
      var received = path.join(__dirname, "b.txt");

      reporter.spawn = (exe, args) => {

        expect(args).to.deep.equal([
          '-d',
          received,
          approved
        ]);

        return {
          status: 0 // success
        };

      }

      reporter.report(approved, received);

    });

  });
});
