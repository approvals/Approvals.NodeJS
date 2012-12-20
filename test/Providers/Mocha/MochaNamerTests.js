var assert = require("assert");
var MochaNamer = require("../../../lib/Providers/Mocha/MochaNamer.js");


describe('MochaNamer', function () {

	describe('when given a mocha context', function () {
		it('should generate correct name', function () {

			var path = "C:\\temp\\";

			var namer = new MochaNamer(this, path);

			var approvedFileName = namer.getApprovedFile();
			var receivedFileName = namer.getReceivedFile();

			assert.equal(approvedFileName,
				path + "MochaNamer.when_given_a_mocha_context.should_generate_correct_name.approved.txt");
			assert.equal(receivedFileName,
				path + "MochaNamer.when_given_a_mocha_context.should_generate_correct_name.received.txt");
		});
	});
});