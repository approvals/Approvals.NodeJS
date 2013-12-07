var utils = require("../../lib/AUtils");
var assert = require("assert");
var path = require("path");
var ReporterUnderTest = require("../../lib/Reporters/opendiffReporter.js");

describe('Reporter', function () {

    if (utils.findProgramOnPath('opendiff')) {
        describe('opendiff', function () {
            it('reporter args are correct', function () {

                var reporter = new ReporterUnderTest();

                var approvedFile = path.join(__dirname, "a.txt");
                var receivedFile = path.join(__dirname, "b.txt");

                assert.ok(reporter.report);
                reporter.report(approvedFile, receivedFile, function (command, args) {

                    assert.ok(command.toLowerCase().indexOf("opendiff") >= 0);
                    assert.deepEqual(args, [receivedFile, approvedFile]);
                });

            });
        });
    }
});
