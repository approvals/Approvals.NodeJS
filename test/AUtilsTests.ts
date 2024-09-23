import assert from "assert";
import {expect} from "chai";
import {assertFileExists, fixFilePathSlashes, searchForExecutable, stringifyKeysInOrder} from "../lib/AUtils";
import {platform} from "../lib/osTools";

describe("AUtils", function () {
  // only run these tests on Windows
  if (platform.isWindows) {
    describe("searchForExecutable", function () {
      if (!process.env.APPVEYOR) {
        describe("when using windows where.exe to find programs", function () {
          it("ipconfig should be found once", function () {
            const file = searchForExecutable("ipconfig");

            assertFileExists(file);
          });

          it("notepad is found multiple times and we should just use the first one", function () {
            const file = searchForExecutable("ipconfig");

            assertFileExists(file);
          });
        });

        describe("When looking for a program in program files", function () {
          it("should find iexplorer", function () {
            const file = searchForExecutable(
              "Internet Explorer",
              "iexplore",
            );

            assertFileExists(file);
          });
        });
      }
    });
  } else {
    describe("find linux executable", function () {
      describe("when using linux 'which' to find programs", function () {
        it("ifconfig should be found once", function () {
          const file = searchForExecutable("ifconfig");

          assertFileExists(file);
        });
      });
    });
  }

  describe("fixFilePathSlashes", function () {
    it("should replace back slashes with forward slashes", function () {
      const before = "C:\\Windows\\System32\\ipconfig.exe";
      const expected = "C:/Windows/System32/ipconfig.exe";

      const fixed = fixFilePathSlashes(before);

      assert.strictEqual(fixed, expected);
    });
  });

  describe("stringifyKeysInOrder", function () {
    const expected = `{
  "a": 1,
  "aSub": {
    "a": 1,
    "a-null-value": null,
    "z": 2
  },
  "arr": [
    1,
    2
  ],
  "b": 2,
  "objArr": [
    {
      "a": 1,
      "b": 2
    },
    {
      "a": 1,
      "b": null
    }
  ]
}`;
    it("should return proper string with keys in order", function () {
      const result = stringifyKeysInOrder({
        a: 1,
        aSub: {
          a: 1,
          z: 2,
          "a-null-value": null,
        },
        objArr: [
          {
            a: 1,
            b: 2,
          },
          {
            b: null,
            a: 1,
          },
        ],
        arr: [1, 2],
        b: 2,
      });
      expect(result).to.equal(expected);
    });

    it("should return proper string with keys in order", function () {
      const result = stringifyKeysInOrder({
        b: 2,
        arr: [1, 2],
        aSub: {
          z: 2,
          a: 1,
          "a-null-value": null,
        },
        objArr: [
          {
            b: 2,
            a: 1,
          },
          {
            b: null,
            a: 1,
          },
        ],
        a: 1,
      });
      expect(result).to.equal(expected);
    });
  });
});
