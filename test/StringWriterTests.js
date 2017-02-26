'use strict';

var assert = require("assert");
var expect = require('chai').expect;
var StringWriter = require("../lib/StringWriter.js");
var fs = require('fs');
var sinon = require('sinon');
var temp = require('temp');
temp.track();
// Write out contest to file (leveraging the Namer)
// Responsible for 'type' of the file.

describe('StringWriter', function () {

  var defaultConfig = {};

  describe('', function () {
    it('should default to type of txt', function () {
      var stringWriter = new StringWriter(defaultConfig, "HELLO");
      assert.equal(stringWriter.getFileExtension(), "txt");
    });

    it('should allow type to be specified', function () {
      var stringWriter = new StringWriter(defaultConfig, "HELLO", "html");
      assert.equal(stringWriter.getFileExtension(), "html");
    });

    it('should write out file', function (done) {
      var config = {};
      var stringWriter = new StringWriter(config, "HELLO");

      var filePath = temp.path({ suffix: '.txt' });

      stringWriter.write(filePath);

      fs.readFile(filePath, 'utf8', function (err, data) {
        assert.equal(data, "HELLO");
        done();
      });
    });

    it('should write out file and append EOL', function (done) {
      var config = {
        appendEOL: true,
        EOL: "EndOfLineConfig"
      };
      var stringWriter = new StringWriter(config, "HELLO");

      var filePath = temp.path({ suffix: '.txt' });

      stringWriter.write(filePath);

      fs.readFile(filePath, 'utf8', function (err, data) {
        assert.equal(data, "HELLO" + "EndOfLineConfig");
        done();
      });

    });

    describe('test', function () {
      var writeFileSyncStub;
      beforeEach(function () {
        writeFileSyncStub = sinon.stub(fs, 'writeFileSync', function () {
          // do nothing
        });
      });

      afterEach(function () {
        writeFileSyncStub.restore();
      });

      it('should write out file and NOT append EOL but warn that it does not have the proper EOL (according to config)', function () {
        var config = {
          appendEOL: true,
          EOL: "\r\n"
        };
        var expectedText = "HELLO\n";
        var stringWriter = new StringWriter(config, expectedText);

        var filePath = temp.path({ suffix: '.txt' });

        stringWriter.write(filePath);

        expect(stringWriter.outputText).to.equal(expectedText);
      });
    });

    it('should write out file and replace line endings', function (done) {
      var config = {
        normalizeLineEndingsTo: "\r\n"
      };
      var stringWriter = new StringWriter(config, "HELLO\nThere\n");

      var filePath = temp.path({ suffix: '.txt' });

      stringWriter.write(filePath);

      fs.readFile(filePath, 'utf8', function (err, data) {
        assert.equal(data, "HELLO\r\nThere\r\n");
        done();
      });

    });

    it('should give a useful error message if value is not a string', function () {
      var config = {
      };

      assert.throws(function () {
        new StringWriter(config, { someObject: "someValue" });
      });
    });

  });
});
