var assert = require("assert");
var ReporterUnderTest = require("../../lib/Reporters/p4mergeReporter.js");

describe('Reporter', function () {
	describe('p4merge', function () {
		it('reporter args are correct', function () {

			var reporter = new ReporterUnderTest();

			var approvedFile = __dirname + "/a.txt";
			var receivedFile = __dirname + "/b.txt";

			reporter.report(approvedFile, receivedFile, function (command, args) {
				assert.equal(command.toLowerCase(), "c:/program files/perforce/p4merge.exe");
				assert.deepEqual(args, [receivedFile, approvedFile]);
			});

		});
	});
});
