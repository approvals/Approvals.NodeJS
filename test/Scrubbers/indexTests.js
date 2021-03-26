var Scrubbers = require("../../lib/Scrubbers/index");
var expect = require('chai').expect;

describe('Scrubbers', function () {

  describe('multiScrubber', function () {

    it('should use each scrubber', () => {

      const multiScrubber = Scrubbers.multiScrubber([
        (input) => input.replace('a', 'A'),
        (input) => input.replace('b', 'B')
      ]);

      const result = multiScrubber("a b c");

      expect(result).to.equal('A B c');

    });

  });

});
