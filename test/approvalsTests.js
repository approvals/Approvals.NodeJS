'use strict';
var fs = require('fs');
var path = require('path');
var approvals = require("../lib/Approvals");

var approvalOverrides = {
  EOL: "\r\n",
  normalizeLineEndingsTo: "\n",
  appendEOL: false
};

describe('approvals', function () {

  describe('verify', function () {
    it('can verify some manual text', function () {
      var testName = "manualVerification";
      var dataToVerify = "some stuff here";
      approvals.verify(__dirname, testName, dataToVerify, approvalOverrides);
    });

    it("should verify an image", function () {

      // copy of the Approvals logo but base64 encoded
      var logoBase46 = "data:image/png;base64,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"

      // copied how to save a base64 image to disk by using
      // http://stackoverflow.com/questions/6926016/nodejs-saving-a-base64-encoded-image-to-disk
      var base64Data = logoBase46.replace(/^data:image\/png;base64,/, "");
      var imgBuffer = new Buffer(base64Data, 'base64');

      approvals.verify(__dirname, "basic-image-test-png", imgBuffer);
    });


    it("should verify an image 2", function () {
      var testImage = path.join(__dirname, "basic-image-test-png.approved.png");
      var imgBuffer = fs.readFileSync(testImage);

      approvals.verify(__dirname, "basic-image-test-png", imgBuffer);
    });
  });

  describe('verifyAsJSON', function () {
    it('can verify some json object', function () {
      var testName = "manualVerificationAsJSON";
      var dataToVerify = {
        x: "some stuff here",
        y: 123
      };
      approvals.verifyAsJSON(__dirname, testName, dataToVerify, approvalOverrides);
    });

    it('can be run with same JSON but keys ordered differently', function () {
      var testName = "manualVerificationAsJSON-Ordered";
      var dataToVerify = {
        x: "some stuff here",
        y: 123
      };
      approvals.verifyAsJSON(__dirname, testName, dataToVerify, approvalOverrides);

      var dataToVerify2 = {
        y: 123,
        x: "some stuff here"
      };
      approvals.verifyAsJSON(__dirname, testName, dataToVerify2, approvalOverrides);
    });
  });

  describe('verifyAsJSONAndScrub', function () {
    it('can verify and scrub some json object', function () {
      var testName = "manualverifyAsJSONAndScrub";
      var dataToVerify = {
        x: "some stuff here",
        y: 123,
        sampleGuid: '3dda561f-903d-4a89-8c96-99ca6272e53d'
      };

      approvals.verifyAsJSONAndScrub(__dirname, testName, dataToVerify, approvals.scrubbers.guidScrubber, approvalOverrides);
    });
  });
});
