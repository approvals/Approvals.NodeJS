import { expect } from "chai";
import sinon from "sinon";

import * as approvals from "../../lib/Approvals.js";

import { testDirectory } from "./testPaths.mjs";

describe("When issues are reported on github", () => {
  it("Issue #86: Issues with Buffer Compare Loop", () => {
    const approvalOverrides = {
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

    const testName = "manualVerification";
    let dataToVerify = "some stuff here";

    const consoleLog = sinon.stub(console, "log");
    try {
      approvals.verify(testDirectory, testName, dataToVerify, approvalOverrides);
    } finally {
      consoleLog.restore();
    }
    expect(String(consoleLog.firstCall.args[0])).to.contain(
      "WARNING: Force approving",
    );

    approvalOverrides.forceApproveAll = false;
    dataToVerify = "some stuff here - also";

    expect(() => {
      approvals.verify(
        testDirectory,
        testName,
        dataToVerify,
        approvalOverrides,
      );
    }).throws(Error);
  });
});
