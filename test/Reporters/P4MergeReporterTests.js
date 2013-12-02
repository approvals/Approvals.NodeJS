var os = require("../../lib/osTools");
var assert = require("assert");
var path = require("path");
var ReporterUnderTest = require("../../lib/Reporters/p4mergeReporter.js");

describe('Reporter', function () {


    if (os.platform.isWindows) {
        describe('p4merge', function () {
            it('reporter args are correct', function () {

                var reporter = new ReporterUnderTest();

                var approvedFile = path.join(__dirname, "a.txt");
                var receivedFile = path.join(__dirname, "b.txt");

                reporter.report(approvedFile, receivedFile, function (command, args) {

                    assert.equal(command.toLowerCase(), "c:/program files/perforce/p4merge.exe");
                    assert.deepEqual(args, [receivedFile, approvedFile]);

                    return {
                        stdout: { on: function () {} },
                        stderr: { on: function () {} }
                    };

                });

            });
        });
    }
});
