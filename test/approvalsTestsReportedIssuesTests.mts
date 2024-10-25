import * as approvals from "../lib/Approvals.js";
import {expect} from "chai";
import {testDirectory} from "./testPaths.mjs";

describe("When issues are reported on github", () => {
  it("Issue #86: Issues with Buffer Compare Loop", () => {
    var approvalOverrides = {
      EOL: "\r\n",
      normalizeLineEndingsTo: "\n",
      appendEOL: false,
      forceApproveAll: true,
      reporters: [
        {
          name: "dummyReporter",
          canReportOn: function () {
            return true;
          },
          report: function () {},
        },
      ],
    };

    var testName = "manualVerification";
    var dataToVerify = "some stuff here";

    approvals.verify(testDirectory, testName, dataToVerify, approvalOverrides);

    approvalOverrides.forceApproveAll = false;
    dataToVerify = "some stuff here - also";

    expect(() => {
      approvals.verify(testDirectory, testName, dataToVerify, approvalOverrides);
    }).throws(Error);
  });
});
