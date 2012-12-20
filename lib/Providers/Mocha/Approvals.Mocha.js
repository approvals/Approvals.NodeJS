/*global beforeEach */

var Namer = require("../../../lib/Namer.js");
var StringWriter = require("../../../lib/StringWriter.js");
var P4MergeReporter = require("../../../lib/Reporters/P4MergeReporter.js");
var FileApprover = require("../../../lib/FileApprover.js");


beforeEach(function () {

	var dir = __dirname;
	var fileName = "spike_test_output";

	var namer = new Namer(dir, fileName);
	var reporter = new P4MergeReporter();

	this.verify = function (data) {
		var writer = new StringWriter(data);
		FileApprover.verify(namer, writer, reporter);
	};
});

