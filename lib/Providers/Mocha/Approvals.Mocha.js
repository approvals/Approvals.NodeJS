/*global beforeEach */
var libRoot = "../../../lib";
var MochaNamer = require("./MochaNamer.js");
var StringWriter = require(libRoot + "/StringWriter.js");
var P4MergeReporter = require(libRoot + "/Reporters/P4MergeReporter.js");
var FileApprover = require(libRoot + "/FileApprover.js");


module.exports = function (args) {

	//if (!args) {
	//	throw 'this module must be called with the "arguments" of the calling test file ex: require" +
	//     '("TODO: how to specify path/Providers/Mocha/Approvals.Mocha")(arguments);';
	//}

	/* a node module's 'args' have the following order
	*
	* args[0] = exports
	* args[1] = require
	* args[2] = module
	* args[3] = __filename
	* args[4] = __dirname
	* 
	*/


	var dirName = args[4];
	if (!dirName) {
		throw 'could not find the __dirname at index 3 of the args parameter.';
	}

	var fileName = args[3];
	if (!dirName) {
		throw 'could not find the __dirname at index 3 of the args parameter.';
	}

	beforeEach(function () {
		var namer = new MochaNamer(this, dirName, fileName);
		var reporter = new P4MergeReporter();

		this.verify = function (data) {
			var writer = new StringWriter(data);
			FileApprover.verify(namer, writer, reporter);
		};
	});
};