import assert from "assert";
import fs from "fs";
import { createRequire } from "module";
import os from "os";
import path from "path";
import sinon from "sinon";
import ReporterUnderTest from "../../../../lib/Reporting/Reporters/webstormReporter.js";
import { ReporterFactory } from "../../../../lib/Reporting/ReporterFactory.js";
import { platform } from "../../../../lib/osTools.js";

const utils = createRequire(import.meta.url)("../../../../lib/AUtils.js");
const WebStormReporter = ReporterUnderTest.default;

describe("WebStormReporter", () => {
  let sandbox;
  let findProgram;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    findProgram = sandbox.stub(utils, "findProgramOnPath").returns(null);
  });

  afterEach(() => {
    sandbox.restore();
  });

  for (const { name, isWindows, isMac, launchers } of [
    {
      name: "Linux discovery",
      isWindows: false,
      isMac: false,
      launchers: ["webstorm", "webstorm.sh"],
    },
    {
      name: "Windows discovery",
      isWindows: true,
      isMac: false,
      launchers: ["webstorm64.exe", "webstorm.exe"],
    },
    {
      name: "macOS discovery",
      isWindows: false,
      isMac: true,
      launchers: ["webstorm"],
    },
  ]) {
    describe(name, () => {
      let exists;
      beforeEach(() => {
        sandbox.stub(platform, "isWindows").value(isWindows);
        sandbox.stub(platform, "isMac").value(isMac);
        exists = sandbox.stub(fs, "existsSync").returns(false);
      });

      for (const launcher of launchers) {
        it(`discovers ${launcher} on PATH`, () => {
          findProgram.withArgs(launcher).returns(`/installed/${launcher}`);
          const reporter = new WebStormReporter();
          assert.strictEqual(reporter.exePath, `/installed/${launcher}`);
        });
      }

      it("prefers the first launcher when multiple launchers are available", () => {
        findProgram.callsFake((launcher) => `/installed/${launcher}`);
        assert.strictEqual(
          new WebStormReporter().exePath,
          `/installed/${launchers[0]}`,
        );
        sinon.assert.calledOnceWithExactly(findProgram, launchers[0]);
      });

      it("is unavailable when no launcher is found", () => {
        const reporter = new WebStormReporter();
        assert.strictEqual(reporter.isReporterAvailable(), false);
        assert.strictEqual(reporter.canReportOn("missing.received.txt"), false);
        assert.deepStrictEqual(
          findProgram.getCalls().map((call) => call.args[0]),
          launchers,
        );
      });
      if (isMac) {
        describe("application discovery", () => {
          for (const directory of [
            "/Applications",
            path.join(os.homedir(), "Applications"),
          ]) {
            it(`discovers WebStorm.app in ${directory}`, () => {
              const launcher = path.join(
                directory,
                "WebStorm.app",
                "Contents",
                "MacOS",
                "webstorm",
              );
              exists.withArgs(launcher).returns(true);
              const reporter = new WebStormReporter();
              assert.strictEqual(reporter.exePath, launcher);
              assert.strictEqual(reporter.isReporterAvailable(), true);
            });
          }

          it("prefers a PATH launcher over application bundles", () => {
            findProgram.withArgs("webstorm").returns("/custom/webstorm");
            exists.returns(true);
            assert.strictEqual(
              new WebStormReporter().exePath,
              "/custom/webstorm",
            );
            sinon.assert.notCalled(exists);
          });

          it("prefers the system installation over the user installation", () => {
            exists.returns(true);
            assert.strictEqual(
              new WebStormReporter().exePath,
              path.join(
                "/Applications",
                "WebStorm.app",
                "Contents",
                "MacOS",
                "webstorm",
              ),
            );
          });

          it("is unavailable when no launcher or application exists", () => {
            assert.strictEqual(
              new WebStormReporter().isReporterAvailable(),
              false,
            );
          });
        });
      }
    });
  }

  it("loads by its built-in configuration name", () => {
    assert.ok(
      ReporterFactory.loadReporter("webstorm") instanceof WebStormReporter,
    );
  });

  it("accepts an explicit launcher for a custom WebStorm installation", () => {
    const executable = "/custom/WebStorm.app/Contents/MacOS/webstorm";
    const reporter = new WebStormReporter(executable);
    sandbox.stub(fs, "existsSync").withArgs(executable).returns(true);
    assert.strictEqual(reporter.exePath, executable);
    assert.strictEqual(reporter.isReporterAvailable(), true);
    sinon.assert.notCalled(findProgram);
    assert.deepStrictEqual(ReporterFactory.loadAllReporters([reporter]), [
      reporter,
    ]);
  });

  it("does not search for another installation when the explicit launcher is missing", () => {
    sandbox.stub(fs, "existsSync").returns(false);
    assert.strictEqual(
      new WebStormReporter("/missing/webstorm").isReporterAvailable(),
      false,
    );
    sinon.assert.notCalled(findProgram);
  });

  for (const blocking of [false, true]) {
    it(`launches a diff with separate path arguments (blocking=${blocking})`, () => {
      const executable = "/Applications/WebStorm.app/Contents/MacOS/webstorm";
      const reporter = new WebStormReporter(executable);
      const spawn = sandbox.stub(reporter, "spawn");
      const spawnSync = sandbox.stub(reporter, "spawnSync");
      sandbox.stub(utils, "createEmptyFileIfNotExists");
      sandbox.stub(console, "log");
      // Keep the test independent of the shared launch limit.
      const circuitBreaker = createRequire(import.meta.url)(
        "../../../../lib/Reporting/ReportLaunchingCircuitBreaker.js",
      );
      sandbox.stub(circuitBreaker.default, "check").returns(false);

      const approved = "/project with spaces/file.approved.txt";
      const received = "/project with spaces/file.received.txt";
      reporter.report(approved, received, {
        blockUntilReporterExits: blocking,
      });

      sinon.assert.calledOnceWithExactly(
        blocking ? spawnSync : spawn,
        executable,
        ["diff", received, approved],
        undefined,
      );
      sinon.assert.notCalled(blocking ? spawn : spawnSync);
      sinon.assert.calledOnceWithExactly(
        utils.createEmptyFileIfNotExists,
        approved,
      );
    });
  }

  it("passes diff arguments through a real child process", () => {
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "webstorm reporter "),
    );
    try {
      const launcher = path.join(directory, "test launcher.cjs");
      const output = path.join(directory, "arguments.json");
      const approved = path.join(directory, "sample file.approved.txt");
      const received = path.join(directory, "sample file.received.txt");
      fs.writeFileSync(received, "received content");
      fs.writeFileSync(
        launcher,
        `require("fs").writeFileSync(${JSON.stringify(output)}, JSON.stringify(process.argv.slice(2)));`,
      );
      // Use Node to run the test launcher on every OS, without a shell.
      const reporter = new WebStormReporter(process.execPath);
      const diffArgs = reporter.setCommandArgs;
      reporter.setCommandArgs = (a, r) => [launcher, ...diffArgs(a, r)];
      sandbox.stub(console, "log");

      reporter.report(approved, received, { blockUntilReporterExits: true });

      assert.deepStrictEqual(JSON.parse(fs.readFileSync(output, "utf8")), [
        "diff",
        received,
        approved,
      ]);
      assert.strictEqual(fs.readFileSync(approved, "utf8"), "");
      assert.strictEqual(fs.readFileSync(received, "utf8"), "received content");
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });
});
