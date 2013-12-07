require("../../../lib/Approvals").jasmine(__dirname);

describe('Jasmine Reporter', function () {

    describe('when verifying some basic text', function () {
        it('should work', function () {

            this.verify("Hello World!");
        });

    });
});
