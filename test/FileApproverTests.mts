import { Reporter } from "../lib/Core/Reporter.js";

import * as ReporterFactory from "../lib/Reporting/ReporterFactory.js";
import * as FileApprover from "../lib/FileApprover.js";
import { StringWriter } from "../lib/StringWriter.js";
import { Namer } from "../lib/Namer.js";
import { expect } from "chai";
import fs from "fs";
import assert from "assert";
import { testDirectory } from "./testPaths.mjs";

class FailingReporter implements Reporter {
  canReportOn(/*file*/) {
    return true;
  }

  report(/*approved, received*/) {
    console.log(arguments);
    throw new Error("This reporter should never run");
  }

  public name = "ShouldFailCustomReporter";
}

describe("FileApprover", function () {
  describe("when two files match", function () {
    var namer;
    var reporterFactory;
    var writer;
    var config = { appendEOL: false };

    beforeEach(function () {
      var dir = testDirectory;
      var fileName = "FileApprover.should_verify_two_files_match";
      namer = new Namer(dir, fileName);
      writer = new StringWriter(config, "HELLO!");
      reporterFactory = function () {
        return [new FailingReporter()];
      };
    });

    describe("when validating arguments", function () {
      it("should validate namer (parameter 1)", function () {
        expect(function () {
          (FileApprover as any).verify(null);
        }).to.throw(Error, "namer");
      });

      it("should validate writer (parameter 2)", function () {
        expect(function () {
          (FileApprover as any).verify(namer, null);
        }).to.throw(Error, "writer");
      });

      it("should validate reporterFactory (parameter 3)", function () {
        expect(function () {
          (FileApprover as any).verify(namer, writer, null);
        }).to.throw(Error, "reporterFactory");
      });
    });

    it("should verify two files match", function () {
      FileApprover.verify(namer, writer, reporterFactory);
    });

    it("should remove the received file", function () {
      FileApprover.verify(namer, writer, reporterFactory);
      var receivedFileName = namer.getReceivedFile(writer.getFileExtension());

      assert.ok(
        !fs.existsSync(receivedFileName),
        "Received File should be deleted",
      );
    });

    it("should raise an event with the approved file name", function (done) {
      var approvedFileName = namer.getApprovedFile(writer.getFileExtension());

      process.once("approvalFileApproved", function (fileName) {
        assert.strictEqual(fileName, approvedFileName);

        done();
      });

      FileApprover.verify(namer, writer, reporterFactory);
    });

    it("should fail the approver if the writer gives something different", function () {
      writer = new StringWriter(config, "BYE");

      assert.throws(function () {
        FileApprover.verify(namer, writer, reporterFactory);
      });
    });
  });

  describe("when configuring the Byte Order Mark (BOM)", function () {
    var namer;
    var reporterFactory;
    var writer;
    var config = {
      appendEOL: false,
      stripBOM: true,
      normalizeLineEndingsTo: "\n",
    };

    beforeEach(function () {
      var dir = testDirectory;
      var fileName = "FileApproverTests.ByteOrderMark";
      namer = new Namer(dir, fileName);
      writer = new StringWriter(
        config,
        "\uFEFFHello Missing Byte Order Mark!\n",
      );
      reporterFactory = function () {
        var x = ReporterFactory.ReporterFactory.loadReporter("gitdiff");
        return [x];
      };
    });

    it("The approved file should have a BOM", function () {
      config.stripBOM = false;
      FileApprover.verify(namer, writer, reporterFactory, config);
    });

    it("The approved file should have a BOM and the local file should not - but shouldn't matter because config says to ignore BOM", function () {
      config.stripBOM = true;
      writer = new StringWriter(config, "Hello Missing Byte Order Mark!\n");
      FileApprover.verify(namer, writer, reporterFactory, config);
    });

    it("The approved file should have a BOM and the local file should not - This should raise an exception because we should be comparing BOMs", function () {
      config.stripBOM = false;
      writer = new StringWriter(config, "Hello Missing Byte Order Mark!\n");
      expect(function () {
        FileApprover.verify(namer, writer, reporterFactory, config);
      }).to.throw;
    });
  });
});
