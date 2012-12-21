//git diff --no-index -- test\Reporters\a.txt test\Reporters\b.txt

var assert = require("assert");
var ReporterUnderTest = require("../../lib/Reporters/GitDiffReporter.js");

describe('Reporter', function () {
	describe('git diff', function () {
		it('reporter args are correct', function () {

			var reporter = new ReporterUnderTest();

			var approved = __dirname + "\\a.txt";
			var received = __dirname + "\\b.txt";

			reporter.report(approved, received, function (command, args) {
				assert.equal(command, "git");
				assert.deepEqual(args, ["diff", "--no-index", "--", received, approved]);
			});
		});

	});
});