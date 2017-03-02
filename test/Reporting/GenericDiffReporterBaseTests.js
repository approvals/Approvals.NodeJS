var fs = require('fs');
var expect = require("chai").expect;
//var path = require("path");
var GenericDiffReporterBase = require("../../lib/Reporting/GenericDiffReporterBase");
var sinon = require('sinon');

describe('GenericDiffReporterBase', function () {
  var sandbox;
  var reporter;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    reporter = new GenericDiffReporterBase();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('default base behavior of', function () {
    describe('isReporterAvailable', function () {
      it('should report true if the app is found', function () {
        sandbox.stub(fs, 'existsSync', () => true);
        expect(reporter.isReporterAvailable()).to.equal(true);
      });

      it('should report false if the app is not found', function () {
        sandbox.stub(fs, 'existsSync', () => false);
        expect(reporter.isReporterAvailable()).to.equal(false);
      });

      it('should only look up on fs once', function () {
        sandbox.stub(fs, 'existsSync', () => false);

        reporter.isReporterAvailable()
        reporter.isReporterAvailable()
        reporter.isReporterAvailable()

        expect(fs.existsSync.callCount).to.equal(1);
      });
    });
  });
});
