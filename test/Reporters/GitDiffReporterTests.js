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

            var expectedCommand;

            if (os.platform.isWindows) {
                expectedCommand = "'C:/Program Files/Git/cmd/git.exe'";
            }
            else {
                expectedCommand = "'/usr/bin/git'";
            }

            expectedCommand += " diff --no-index -- " + received + " " + approved;

            reporter.report(approved, received, function (command) {

                // TODO: find a way to fix up the linux/mac 'git path' instead of hacking by replaces
                var pathTrimmedCommand = command
					.replace("git.cmd", "git.exe") // cmd is good enough
                    .replace(" (x86)", "")       // Win x86 folder trim
					.replace("local/git/", '');  // Git was installed here on the mac


                assert.equal(pathTrimmedCommand, expectedCommand);
                return {};
            });
        });

    });
});
