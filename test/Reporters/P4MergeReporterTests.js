var assert = require("assert");
var P4MergeReporter = require("../../lib/Reporters/P4MergeReporter.js");

describe('Reporter', function () {
	describe('p4merge', function () {
		it('should use p4merge to report', function () {

			var reporter = new P4MergeReporter();

			var approvedFile = __dirname + "\\a.txt";
			var receivedFile = __dirname + "\\b.txt";

			reporter.report(approvedFile, receivedFile, function (command, args) {
				assert.equal(command, "C:\\Program Files\\Perforce\\p4merge.exe");
				assert.deepEqual(args, [receivedFile, approvedFile]);
			});
		});

	});
});