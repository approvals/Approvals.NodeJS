//git diff --no-index -- test\Reporters\a.txt test\Reporters\b.txt

var assert = require("assert");
var path = require("path");
var ReporterUnderTest = require("../../lib/Reporters/gitdiffReporter.js");

describe('Reporter', function () {
	describe('git diff', function () {
		it('reporter args are correct', function () {

			var reporter = new ReporterUnderTest();

			var approved = path.join(__dirname, "a.txt");
			var received = path.join(__dirname, "b.txt");

			var expectedCommand;

			if(process.platform.indexOf("win") !== -1) {
				expectedCommand = "'C:/Program Files/Git/cmd/git.exe'";
			}
			else {
				expectedCommand = "'/usr/bin/git'";
			}

			expectedCommand += " diff --no-index -- " + received + " " + approved;

			reporter.report(approved, received, function (command) {

				var pathTrimmedCommand = command.replace(" (x86)", "");

				assert.equal(pathTrimmedCommand, expectedCommand);
				return {};
			});
		});

	});
});
