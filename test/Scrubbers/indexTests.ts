import {Scrubbers} from "../../lib/Scrubbers/Scrubbers";
import {expect} from "chai";

describe("Scrubbers", function () {
  describe("multiScrubber", function () {
    it("should use each scrubber", () => {
      const multiScrubber = Scrubbers.multiScrubber([
        (input) => input.replace("a", "A"),
        (input) => input.replace("b", "B"),
      ]);

      const result = multiScrubber("a b c");

      expect(result).to.equal("A B c");
    });
  });
});
