
// run this test by calling
// > mocha .\examples\sample.Mocha.js


// Places a 'verify(...)' method on the Mocha context var 'this'.
require("../lib/Providers/Mocha/Approvals.Mocha")(arguments);

describe('With a Mocha describe', function () {
	describe('And a Mocha sub-describe', function () {
		it('should be able to use Approvals', function () {

			var data = "Hello World!";

			// Call the Approvals verify with our data.
			this.verify(data);
		});
	});
});
