var approvals = require("../lib/Approvals.js").configure({
  EOL:  "\n",
  appendEOL: true
});

describe('approvals', function () {

  describe('verify', function () {
    it('can verify some manual text', function () {
      var testName = "manualVerification";
      var dataToVerify =  "some stuff here";
      var reporters = ["gitdiff"]; //blank for now Need to work round the global unit test reporter problem...
      approvals.verify(__dirname, testName, dataToVerify, reporters);
    });
  });

  describe('verifyAsJSON', function () {
    it('can verify some manual text', function () {
      var testName = "manualVerificationAsJSON";
      var dataToVerify =  {
        x: "some stuff here",
        y: 123
      };
      var reporters = ["gitdiff"]; //blank for now Need to work round the global unit test reporter problem...
      approvals.verifyAsJSON(__dirname, testName, dataToVerify, reporters);
    });
  });
});
