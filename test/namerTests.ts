import assert from "assert";
import path from "path";
import {Namer} from "../lib/Namer";

describe("Namer", function () {
  describe("getReceivedFile & approvedFile", function () {
    it("should format a path that has no trailing separator", function () {
      const pathWithoutTrailingSlash = "C:\\temp";
      const fileName = "foo.js";
      const namer = new Namer(pathWithoutTrailingSlash, fileName);

      assert.strictEqual(
        namer.getReceivedFile("txt"),
        path.join("C:\\temp", "foo.js.received.txt"),
      );

      assert.strictEqual(
        namer.getApprovedFile("png"),
        path.join("C:\\temp", "foo.js.approved.png"),
      );
    });

    it("should clean up not normalized input", function () {
      const pathWithoutTrailingSlash = "C:\\temp" + path.sep;
      const fileName = "foo.js.";
      const namer = new Namer(pathWithoutTrailingSlash, fileName);

      assert.strictEqual(
        namer.getReceivedFile(".txt"),
        path.join("C:\\temp", "foo.js.received.txt"),
      );
    });
  });
});
