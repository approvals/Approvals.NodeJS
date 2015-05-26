'use strict';

var approvals = require("../../../lib/Approvals");

describe('Mocha', function() {

  describe('when verifying some basic text', function () {
    beforeEach(function() {
      approvals.configure({
        appendEOL: false,
        reporters: ["nodediff"]
      })
      .mocha(__dirname);
    });

    it('should work', function () {
      this.verify("Hello World!");
    });

    it('should verifyAsJSON', function () {
      var value = {a:1, b:"bar"};

      this.verifyAsJSON(value);
    });
  });
});
