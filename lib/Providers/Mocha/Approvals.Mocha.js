/*global beforeEach */

var MochaNamer = require("./MochaNamer.js");
var StringWriter = require("../../../lib/StringWriter.js");
var P4MergeReporter = require("../../../lib/Reporters/P4MergeReporter.js");
var FileApprover = require("../../../lib/FileApprover.js");


beforeEach(function () {
	var TODO_GET_PATH = "TODO";
	var namer = new MochaNamer(this, TODO_GET_PATH);
	var reporter = new P4MergeReporter();

	console.log(__dirname);
	console.log(__filename);

	this.verify = function (data) {
		var writer = new StringWriter(data);
		FileApprover.verify(namer, writer, reporter);
	};
});

