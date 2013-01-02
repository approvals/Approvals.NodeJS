require('approvals').mocha(__dirname);

describe('With a Mocha describe', function () {
	describe('And a Mocha sub-describe', function () {
		it('should be able to use Approvals', function () {

			var data = "Hello World!";

			// Call the Approvals verify with our data.
 			this.verify(data);
		});
	});
});
