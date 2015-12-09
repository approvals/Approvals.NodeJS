'use strict';

var assert = require("assert");
var StringWriter = require("../lib/StringWriter.js");
var fs = require('fs');
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

      var filePath = temp.path({suffix: '.txt'});

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

      var filePath = temp.path({suffix: '.txt'});

      stringWriter.write(filePath);

      fs.readFile(filePath, 'utf8', function (err, data) {
        assert.equal(data, "HELLO" + "EndOfLineConfig");
        done();
      });

    });

    it('should write out file and replace line endings', function (done) {
      var config = {
        normalizeLineEndingsTo: "\r\n"
      };
      var stringWriter = new StringWriter(config, "HELLO\nThere\n");

      var filePath = temp.path({suffix: '.txt'});

      stringWriter.write(filePath);

      fs.readFile(filePath, 'utf8', function (err, data) {
        assert.equal(data, "HELLO\r\nThere\r\n");
        done();
      });

    });

  });
});
