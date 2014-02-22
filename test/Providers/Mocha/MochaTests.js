
describe('Mocha', function () {

	require("../../../lib/Approvals").mocha(__dirname);

    describe('when verifying some basic text', function () {
        it('should work', function () {

            this.verify("Hello World!");

        });

        it('should verifyAsJSON', function () {

            var value = {a:1, b:"bar"};

            this.verifyAsJSON(value);

        });        
    });
});
