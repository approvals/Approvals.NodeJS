"use strict";

import assert from "assert";
import path from "path";

import { MochaNamer } from "../../../../lib/Providers/Mocha/MochaNamer.js";

describe("MochaNamer", function () {
  describe("when given a mocha context", function () {
    it("should generate correct name", function () {
      const fullTestFilePathStub = "C:\\temp\\";

      const namer = new MochaNamer(this);

      // hack the path (for testing purposes);
      namer.basePath = fullTestFilePathStub;

      const approvedFileName = namer.getApprovedFile();
      const receivedFileName = namer.getReceivedFile();

      assert.strictEqual(
        approvedFileName,
        path.join(
          fullTestFilePathStub,
          "MochaNamer.when_given_a_mocha_context.should_generate_correct_name.approved.txt",
        ),
      );
      assert.strictEqual(
        receivedFileName,
        path.join(
          fullTestFilePathStub,
          "MochaNamer.when_given_a_mocha_context.should_generate_correct_name.received.txt",
        ),
      );
    });
  });
});
