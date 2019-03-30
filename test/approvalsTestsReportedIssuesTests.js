var approvals = require("../lib/Approvals");
var expect = require('chai').expect;

describe('When issues are reported on github', () => {

  it("Issue #86: Issues with Buffer Compare Loop", () => {
    var approvalOverrides = {
      EOL: "\r\n",
      normalizeLineEndingsTo: "\n",
      appendEOL: false,
      forceApproveAll: true,
      reporters: [
        {
          name: "dummyReporter",
          canReportOn: function () { return true; },
          report: function () { }
        }
      ]
    };

    var testName = "manualVerification";
    var dataToVerify = "some stuff here";

    approvals.verify(__dirname, testName, dataToVerify, approvalOverrides);

    approvalOverrides.forceApproveAll = false;
    dataToVerify = "some stuff here - also";

    expect(() => {
      approvals.verify(__dirname, testName, dataToVerify, approvalOverrides);
    }).throws(Error);

  });

});
