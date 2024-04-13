'use strict';

var assert = require("assert");
var path = require("path");
var Namer = require("../lib/Namer").Namer;

describe('Namer', function () {

  describe('getReceivedFile & approvedFile', function () {
    it('should format a path that has no trailing separator', function () {
      var pathWithoutTrailingSlash = "C:\\temp";
      var fileName = "foo.js";
      var namer = new Namer(pathWithoutTrailingSlash, fileName);

      assert.strictEqual(namer.getReceivedFile("txt"), path.join("C:\\temp", "foo.js.received.txt"));

      assert.strictEqual(namer.getApprovedFile("png"), path.join("C:\\temp", "foo.js.approved.png"));
    });

    it('should clean up not normalized input', function () {
      var pathWithoutTrailingSlash = "C:\\temp" + path.sep;
      var fileName = "foo.js.";
      var namer = new Namer(pathWithoutTrailingSlash, fileName);

      assert.strictEqual(namer.getReceivedFile(".txt"), path.join("C:\\temp", "foo.js.received.txt"));
    });
  });
});
