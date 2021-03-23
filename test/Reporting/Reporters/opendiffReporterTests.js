'use strict';

var utils = require("../../../lib/AUtils");
var assert = require("assert");
var path = require("path");
var { expect } = require('chai');
var ReporterUnderTest = require("../../../lib/Reporting/Reporters/opendiffReporter.js");

describe('Reporter', function () {

  if (utils.findProgramOnPath('opendiff')) {
    describe('opendiff', function () {
      it('reporter args are correct', function () {

        var reporter = new ReporterUnderTest();

        var approvedFile = path.join(__dirname, "a.txt");
        var receivedFile = path.join(__dirname, "b.txt");

        assert.ok(reporter.report);
        reporter.report(approvedFile, receivedFile, {
          spawn: function (command, args) {

            assert.ok(command.toLowerCase().indexOf("opendiff") >= 0);
            assert.deepEqual(args, [receivedFile, approvedFile]);

            return {
              status: 0,
              stdout: { on: function () { } },
              stderr: { on: function () { } }
            };
          }
        });

      });

      it('reporter args are correct', function () {

        var reporter = new ReporterUnderTest();

        var approvedFile = path.join(__dirname, "a.txt");
        var receivedFile = path.join(__dirname, "b.txt");

        expect(() => {
          reporter.report(approvedFile, receivedFile, {
            spawn: function (command, args) {

              assert.ok(command.toLowerCase().indexOf("opendiff") >= 0);
              assert.deepEqual(args, [receivedFile, approvedFile]);

              return {
                status: 1,
                stdout: Buffer.from(''),
                stderr: Buffer.from('xcode-select: error: tool \'opendiff\' requires Xcode, but active developer directory \'/Library/Developer/CommandLineTools\' is a command line tools instance'),
              };
            }
          });
        }).to.throw(/Could not launch diff tool: /);

      });
    });
  }
});
