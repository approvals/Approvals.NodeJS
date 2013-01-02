'use strict';
var Namer = require("../lib/Namer.js");
var StringWriter = require("../lib/StringWriter.js");
var P4MergeReporter = require("../lib/Reporters/p4mergeReporter.js");
var FileApprover = require("../lib/FileApprover.js");


describe('FileApprover', function () {

	describe('', function () {
		it('should verify two files match', function () {

			var dir = __dirname;
			var fileName = "FileApprover.should_verify_two_files_match";

			var namer = new Namer(dir, fileName);
			var writer = new StringWriter("HELLO!");
			var reporter = new P4MergeReporter();

			FileApprover.verify(namer, writer, reporter);

		});
	});
});
