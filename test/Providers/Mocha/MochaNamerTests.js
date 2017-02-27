'use strict';

var assert = require("assert");
var path = require('path');
var MochaNamer = require("../../../lib/Providers/Mocha/MochaNamer.js");

describe('MochaNamer', function () {

  describe('when given a mocha context', function () {
    it('should generate correct name', function () {
      var fullTestFilePathStub = "C:\\temp\\";

      var namer = new MochaNamer(this);

      // hack the path (for testing purposes);
      namer.path = fullTestFilePathStub;

      var approvedFileName = namer.getApprovedFile();
      var receivedFileName = namer.getReceivedFile();

      assert.equal(approvedFileName,
        path.join(fullTestFilePathStub,
          "MochaNamer.when_given_a_mocha_context.should_generate_correct_name.approved.txt"));
      assert.equal(receivedFileName,
        path.join(fullTestFilePathStub,
          "MochaNamer.when_given_a_mocha_context.should_generate_correct_name.received.txt"));
    });
  });
});
