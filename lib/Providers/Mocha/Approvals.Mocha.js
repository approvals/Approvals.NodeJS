/*global beforeEach */
var libRoot = "../../../lib";
var MochaNamer = require("./MochaNamer.js");
var StringWriter = require(libRoot + "/StringWriter.js");
var FileApprover = require(libRoot + "/FileApprover.js");
var ReporterFactory = require(libRoot + "/Reporters/ReporterFactory.js");
var fs = require('fs');

module.exports = function (options, dirName) {

	if (!dirName) {
		throw "'dirName' parameter not found. Try using the following syntax. > require('Approvals').mocha(__dirname);";
	}

	// Make sure it's a valid directory
	var stats = fs.lstatSync(dirName);
	if (!stats.isDirectory()) {
		throw "Invalid directory [" + dirName + "]. Try using the following syntax. > require('Approvals').mocha(__dirname);";
	}

	beforeEach(function () {
		var namer = new MochaNamer(this, dirName);
		var reporter = ReporterFactory.loadReporter(options.reporter);

		this.verify = function (data) {
			var writer = new StringWriter(data);
			FileApprover.verify(namer, writer, reporter);
		};
	});
};