
describe('Mocha', function () {

  describe('when verifying some basic text', function () {

    require("../../../lib/Approvals")
      .configure({
        errorOnStaleApprovedFiles: false
      })
    .mocha(__dirname);

    it('should work', function () {
      this.timeout(10000);

      this.verify("Hello World!");

    });

    it('should verifyAsJSON', function () {
      this.timeout(10000);

      var value = {a:1, b:"bar"};

      this.verifyAsJSON(value);

    });
  });
});
