import fs from "fs";

import { expect } from "chai";
import sinon from "sinon";

import {
  setNamer,
  verify,
} from "../../../lib/Providers/Mocha/MochaApprovals.js";
import { GenericDiffReporterBase } from "../../../lib/Reporting/GenericDiffReporterBase.js";

describe("GenericDiffReporterBase", function () {
  let sandbox;
  let reporter;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    reporter = new GenericDiffReporterBase("test");
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe("default base behavior of", function () {
    describe("isReporterAvailable", function () {
      it("should report true if the app is found", function () {
        sandbox.stub(fs, "existsSync").callsFake(() => true);
        expect(reporter.isReporterAvailable()).to.equal(true);
      });

      it("should report false if the app is not found", function () {
        sandbox.stub(fs, "existsSync").callsFake(() => false);
        expect(reporter.isReporterAvailable()).to.equal(false);
      });

      it("should only look up on fs once", function () {
        const fake = sandbox.stub(fs, "existsSync").callsFake(() => false);

        reporter.isReporterAvailable();
        reporter.isReporterAvailable();
        reporter.isReporterAvailable();

        expect(fake.callCount).to.equal(1);
      });
    });
  });

  describe("running a reporter", function () {
    const writeToBothStreams =
      'process.stdout.write("to stdout"); process.stderr.write("to stderr");';
    let logged: string[];

    beforeEach(function () {
      setNamer(this);
      logged = [];
      sandbox.stub(console, "log").callsFake((...args) => {
        logged.push(args.join(" "));
      });
    });

    it("requires a name", function () {
      expect(() => new GenericDiffReporterBase("")).to.throw(
        "Argument name missing",
      );
    });

    it("can report on a binary file when it can image diff", function () {
      class ImageReporter extends GenericDiffReporterBase {
        canImageDiff(): boolean {
          return true;
        }
      }
      const image = new ImageReporter("image");
      sandbox.stub(image, "isReporterAvailable").returns(true);
      sandbox.stub(fs, "existsSync").returns(true);

      expect(image.canReportOn("picture.png")).to.equal(true);
    });

    it("logs stdout and stderr of an asynchronously spawned process", async function () {
      const child = reporter.spawn(process.execPath, [
        "-e",
        writeToBothStreams,
      ]);
      await new Promise((resolve) => child.on("close", resolve));

      verify(logged.join("\n--- next log call ---\n"));
    });

    it("logs only stderr of a synchronously spawned process", function () {
      reporter.spawnSync(process.execPath, [
        "-e",
        'process.stderr.write("only stderr");',
      ]);

      verify(logged.join("\n--- next log call ---\n"));
    });

    it("logs stdout and stderr of a synchronously spawned process", function () {
      reporter.spawnSync(process.execPath, ["-e", writeToBothStreams]);

      verify(logged.join("\n--- next log call ---\n"));
    });
  });
});
