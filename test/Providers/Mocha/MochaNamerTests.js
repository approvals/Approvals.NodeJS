var assert = require("assert");
var MochaNamer = require("../../../lib/Providers/Mocha/MochaNamer.js");


describe('MochaNamer', function () {

	describe('when given a mocha context', function () {
		it('should generate correct name', function () {
			var namer = new MochaNamer(this);

			assert.equal(namer.getFullTestName(), 
				"MochaNamer.when_given_a_mocha_context.should_generate_correct_name");
		});
	});
});