//git diff --no-index -- test\Reporters\a.txt test\Reporters\b.txt

var assert = require("assert");
var os = require("../../lib/osTools");
var path = require("path");
var ReporterUnderTest = require("../../lib/Reporters/gitdiffReporter.js");

describe('Reporter', function () {
    describe('git diff', function () {
        it('reporter args are correct', function () {

            var reporter = new ReporterUnderTest();

            var approved = path.join(__dirname, "a.txt");
            var received = path.join(__dirname, "b.txt");

            var expectedCommand = "'git' diff --no-index -- " + received + " " + approved;

            reporter.report(approved, received, function (command) {

                var pathTrimmedCommand = command
                  .replace("git.cmd'", "git")
                  .replace("git.exe'", "git")
                ;

                var startTrim = pathTrimmedCommand.indexOf("git' diff")
                pathTrimmedCommand = "'" + pathTrimmedCommand.substr(startTrim);

                assert.equal(pathTrimmedCommand, expectedCommand);
                return {};
            });
        });

    });
});
