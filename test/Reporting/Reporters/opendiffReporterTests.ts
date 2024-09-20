"use strict";

import {testDirectory} from "../../testPaths";

var utils = require("../../../lib/AUtils");
var assert = require("assert");
var path = require("path");
var { expect } = require("chai");
var ReporterUnderTest = require("../../../lib/Reporting/Reporters/opendiffReporter");

describe("Reporter", function () {
  if (utils.findProgramOnPath("opendiff")) {
    describe("opendiff", function () {
      xit("reporter args are correct", function () {
        var reporter = new ReporterUnderTest();

        var approvedFile = path.join(testDirectory, "Reporting", "Reporters", "a.txt");
        var receivedFile = path.join(testDirectory, "Reporting", "Reporters", "b.txt");

        assert.ok(reporter.report);
        reporter.report(approvedFile, receivedFile, {
          spawn: function (command, args) {
            assert.ok(command.toLowerCase().indexOf("opendiff") >= 0);
            assert.deepStrictEqual(args, [receivedFile, approvedFile]);

            return {
              status: 0,
              stdout: { on: function () {} },
              stderr: { on: function () {} },
            };
          },
        });
      });

      xit("reporter args are correct", function () {
        var reporter = new ReporterUnderTest();

        var approvedFile = path.join(testDirectory, "Reporting", "Reporters", "a.txt");
        var receivedFile = path.join(testDirectory, "Reporting", "Reporters", "b.txt");

        expect(() => {
          reporter.report(approvedFile, receivedFile, {
            spawn: function (command, args) {
              assert.ok(command.toLowerCase().indexOf("opendiff") >= 0);
              assert.deepStrictEqual(args, [receivedFile, approvedFile]);

              return {
                status: 1,
                stdout: Buffer.from(""),
                stderr: Buffer.from(
                  "xcode-select: error: tool 'opendiff' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance",
                ),
              };
            },
          });
        }).to.throw(/Could not launch diff tool/);
      });
    });
  }
});
