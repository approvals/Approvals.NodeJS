'use strict';

var approvalOverrides = {
  EOL: "\r\n",
  normalizeLineEndingsTo: "\n",
  appendEOL: false
};
var approvals = require("../lib/Approvals");

describe('approvals', function () {

  describe('verify', function () {
    it('can verify some manual text', function () {
      var testName = "manualVerification";
      var dataToVerify =  "some stuff here";
      approvals.verify(__dirname, testName, dataToVerify, approvalOverrides);
    });
  });

  describe('verifyAsJSON', function () {
    it('can verify some manual text', function () {
      var testName = "manualVerificationAsJSON";
      var dataToVerify =  {
        x: "some stuff here",
        y: 123
      };
      approvals.verifyAsJSON(__dirname, testName, dataToVerify, approvalOverrides);
    });
  });
});
