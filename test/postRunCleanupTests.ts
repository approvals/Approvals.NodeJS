import { verify } from "../lib/Approvals";
import * as approvals from "../lib/Approvals";
import { expect } from "chai";
import sinon from "sinon";
import { postRunCleanup } from "../lib/postRunCleanup";

var glob = require("glob");

describe("postRunCleanup", function () {
  it("should export a cleanup function", function () {
    expect(postRunCleanup).to.be.a("function");
  });

  describe("When there is a stale approved file", function () {
    var globSyncStub;
    var approvedFilesMap = [
      // windows path example
      "C:\\Users\\jason\\code\\Approvals.NodeJS\\test\\should-exist-windows.approved.txt",
      // linux/mac path example
      "/Users/jason/code/Approvals.NodeJS/test/should-exist-mac.approved.txt",
    ];

    beforeEach(function () {
      globSyncStub = sinon.stub(glob, "sync").callsFake(function () {
        return [
          "should-not-exist.approved.txt",
          "C:\\Users\\jason\\code\\Approvals.NodeJS\\test\\should-exist-windows.approved.txt",
          "/Users/jason/code/Approvals.NodeJS/test/should-exist-mac.approved.txt",
        ];
      });
    });

    afterEach(function () {
      globSyncStub.restore();
    });

    it("should not run when config has it turned off", function () {
      expect(function () {
        postRunCleanup(
          {
            errorOnStaleApprovedFiles: false,
          },
          approvedFilesMap,
        );
      }).to.not.throw;
    });

    it("should report the invalid file when config is on", function () {
      var didError = false;
      try {
        postRunCleanup(
          {
            errorOnStaleApprovedFiles: true,
          },
          approvedFilesMap,
        );
      } catch (err: any) {
        didError = true;
        verify(__dirname, "postRunCleanup_reporting_bad_file", err.toString());
      }

      if (!didError) {
        throw new Error(
          "This test should have raised an error but did not... FIX IT?",
        );
      }
    });
  });
});
