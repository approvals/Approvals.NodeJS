require("../../../lib/Approvals")
    .jasmine(__dirname);

describe('Jasmine Reporter', function () {

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
