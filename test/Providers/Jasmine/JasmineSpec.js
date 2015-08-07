'use strict';

require("../../../lib/Approvals")
  .jasmine();

describe('Jasmine Reporter', function() {

  describe('when verifying some basic text', function() {

    it('should work', function() {
      this.timeout(10000);

      this.verify("Hello World!");

    });

    it('should verifyAsJSON', function() {
      this.timeout(10000);

      var value = {
        a: 1,
        b: "bar"
      };

      this.verifyAsJSON(value);
    });

  });
});
