import { verify } from "../lib/Approvals.js";
import { expect } from "chai";
import { postRunCleanup } from "../lib/postRunCleanup.js";
import { testDirectory } from "./testPaths.mjs";

describe("postRunCleanup", function () {
  describe("When there is a stale approved file", function () {
    const approvedFilesMap = [
      // windows path example
      "C:\\Users\\jason\\code\\Approvals.NodeJS\\test\\should-exist-windows.approved.txt",
      // linux/mac path example
      "/Users/jason/code/Approvals.NodeJS/test/should-exist-mac.approved.txt",
    ];

    const fakeGlobSync = function () {
      return [
        "should-not-exist.approved.txt",
        "C:\\Users\\jason\\code\\Approvals.NodeJS\\test\\should-exist-windows.approved.txt",
        "/Users/jason/code/Approvals.NodeJS/test/should-exist-mac.approved.txt",
      ];
    };

    it("should not run when config has it turned off", function () {
      expect(function () {
        postRunCleanup(
          {
            errorOnStaleApprovedFiles: false,
          },
          approvedFilesMap,
          fakeGlobSync,
        );
      }).to.not.throw;
    });

    it("should report the invalid file when config is on", function () {
      let didError = false;
      try {
        postRunCleanup(
          {
            errorOnStaleApprovedFiles: true,
          },
          approvedFilesMap,
          fakeGlobSync,
        );
      } catch (err: any) {
        didError = true;
        verify(
          testDirectory,
          "postRunCleanup_reporting_bad_file",
          err.toString(),
        );
      }

      if (!didError) {
        throw new Error(
          "This test should have raised an error but did not... FIX IT?",
        );
      }
    });
  });
});
