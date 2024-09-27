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

          const expectedCommand = [receivedFile, approvedFile];

          const args = reporter.getCommandArguments(approvedFile, receivedFile);
          assert.deepEqual(expectedCommand, args.args);
          assert.ok(args.cmdOptions.toLowerCase().indexOf("opendiff") >= 0);
      });
    });
  }
});
