var assert = require("assert");
var MochaNamer = require("../../../lib/Providers/Mocha/MochaNamer.js");


describe('MochaNamer', function () {

	describe('when given a mocha context', function () {
		it('should generate correct name', function () {

			var path = "C:\\temp\\";
			var fileName = "C:\\temp\\foo.js";

			var namer = new MochaNamer(this, path, fileName);

			var approvedFileName = namer.getApprovedFile();
			var receivedFileName = namer.getReceivedFile();

			assert.equal(approvedFileName,
				"C:\\temp\\foo.js" + 
				".MochaNamer.when_given_a_mocha_context.should_generate_correct_name.approved.txt");
			assert.equal(receivedFileName,
				"C:\\temp\\foo.js" + 
				".MochaNamer.when_given_a_mocha_context.should_generate_correct_name.received.txt");
		});
	});
});