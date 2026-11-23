import assert from "assert";
import fs from "fs";
import os from "os";
import path from "path";

import { expect } from "chai";
import sinon from "sinon";

import { Config } from "../../lib/config.js";
import { StringWriter } from "../../lib/StringWriter.js";

const tempDirectory = fs.mkdtempSync(
  path.join(os.tmpdir(), "approvals-stringwriter-"),
);
let tempFileCount = 0;

function tempTextFilePath(): string {
  tempFileCount++;
  return path.join(tempDirectory, `file${tempFileCount}.txt`);
}

after(function () {
  fs.rmSync(tempDirectory, { recursive: true, force: true });
});

describe("StringWriter", function () {
  const defaultConfig: Partial<Config> = {};

  describe("", function () {
    it("should default to type of txt", function () {
      const stringWriter = new StringWriter(defaultConfig, "HELLO");
      assert.strictEqual(stringWriter.getFileExtension(), "txt");
    });

    it("should allow type to be specified", function () {
      const stringWriter = new StringWriter(defaultConfig, "HELLO", "html");
      assert.strictEqual(stringWriter.getFileExtension(), "html");
    });

    it("should write out file", function (done) {
      const config = {};
      const stringWriter = new StringWriter(config, "HELLO");

      const filePath = tempTextFilePath();

      stringWriter.write(filePath);

      fs.readFile(filePath, "utf8", function (_error, data) {
        assert.strictEqual(data, "HELLO");
        done();
      });
    });

    it("should write out file and append EOL", function (done) {
      const config = {
        appendEOL: true,
        EOL: "EndOfLineConfig",
      };
      const stringWriter = new StringWriter(config, "HELLO");

      const filePath = tempTextFilePath();

      stringWriter.write(filePath);

      fs.readFile(filePath, "utf8", function (_error, data) {
        assert.strictEqual(data, "HELLO" + "EndOfLineConfig");
        done();
      });
    });

    describe("test", function () {
      let writeFileSyncStub;
      beforeEach(function () {
        writeFileSyncStub = sinon.stub(fs, "writeFileSync");
      });

      afterEach(function () {
        writeFileSyncStub.restore();
      });

      it("should write out file and NOT append EOL but warn that it does not have the proper EOL (according to config)", function () {
        const config = {
          appendEOL: true,
          EOL: "\r\n",
        };
        const expectedText = "HELLO\n";
        const stringWriter = new StringWriter(config, expectedText);

        const filePath = tempTextFilePath();

        stringWriter.write(filePath);

        expect(stringWriter.outputText).to.equal(expectedText);
      });
    });

    it("should write out file and replace line endings", function (done) {
      const config = {
        normalizeLineEndingsTo: "\r\n",
      };
      const stringWriter = new StringWriter(config, "HELLO\nThere\n");

      const filePath = tempTextFilePath();

      stringWriter.write(filePath);

      fs.readFile(filePath, "utf8", function (_error, data) {
        assert.strictEqual(data, "HELLO\r\nThere\r\n");
        done();
      });
    });

    it("should give a useful error message if value is not a string", function () {
      const config = {};

      assert.throws(function () {
        new StringWriter(config, { someObject: "someValue" } as any as string);
      });
    });
  });
});
