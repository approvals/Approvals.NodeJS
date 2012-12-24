var assert = require("assert");
var ReporterUnderTest = require("../../lib/Reporters/P4MergeReporter.js");

describe('Reporter', function () {
	describe('p4merge', function () {
		it('reporter args are correct', function () {

			var reporter = new ReporterUnderTest();

			var approvedFile = __dirname + "/a.txt";
			var receivedFile = __dirname + "/b.txt";

			reporter.report(approvedFile, receivedFile, function (command, args) {
				assert.equal(command, "C:/program files/Perforce/p4merge.exe");
				assert.deepEqual(args, [receivedFile, approvedFile]);
			});

		});
	});
});