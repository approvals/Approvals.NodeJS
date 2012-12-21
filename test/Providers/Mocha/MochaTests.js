require("../../../lib/Approvals").mocha(__dirname);


describe('Mocha', function () {

	describe('when verifying some basic text', function () {
		it('should work', function () {

			this.verify("Hello World!");

		});
	});
});