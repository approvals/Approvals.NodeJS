'use strict';

var utils = require("../lib/AUtils");
var os = require("../lib/osTools");
var assert = require("assert");
var expect = require('chai').expect;

describe('AUtils', function () {

  // only run these tests on Windows
  if (os.platform.isWindows) {

    describe('searchForExecutable', function () {
      if (!process.env.APPVEYOR) {
        describe("when using windows where.exe to find programs", function () {
          it('ipconfig should be found once', function () {

            var file = utils.searchForExecutable("ipconfig");

            utils.assertFileExists(file);
          });

          it('notepad is found multiple times and we should just use the first one', function () {

            var file = utils.searchForExecutable("ipconfig");

            utils.assertFileExists(file);
          });
        });

        describe("When looking for a program in program files", function () {
          it("should find iexplorer", function () {

            var file = utils.searchForExecutable("Internet Explorer", "iexplore");

            utils.assertFileExists(file);
          });
        });
      }
    });
  } else {
    describe('find linux executable', function () {
      describe("when using linux 'which' to find programs", function () {
        it('ifconfig should be found once', function () {

          var file = utils.searchForExecutable("ifconfig");

          utils.assertFileExists(file);
        });
      });
    });
  }

  describe('fixFilePathSlashes', function () {
    it("should replace back slashes with forward slashes", function () {

      var before = "C:\\Windows\\System32\\ipconfig.exe";
      var expected = "C:/Windows/System32/ipconfig.exe";

      var fixed = utils.fixFilePathSlashes(before);

      assert.equal(fixed, expected);
    });
  });


  describe('stringifyKeysInOrder', function () {
    var expected = `{
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
      "b": 2
    }
  ]
}`;
    it("should return proper string with keys in order", function () {
      var result = utils.stringifyKeysInOrder({
        a: 1,
        aSub: {
          a: 1,
          z: 2,
          "a-null-value": null
        },
        objArr: [
          {
            a: 1,
            b: 2
          },
          {
            b: 2,
            a: 1
          }
        ],
        arr: [1,2],
        b: 2
      });
      expect(result).to.equal(expected);
    });

    it("should return proper string with keys in order", function () {
      var result = utils.stringifyKeysInOrder({
        b: 2,
        arr: [1,2],
        aSub: {
          z: 2,
          a: 1,
          "a-null-value": null
        },
        objArr: [
          {
            b: 2,
            a: 1
          },
          {
            b: 2,
            a: 1
          }
        ],
        a: 1,
      });
      expect(result).to.equal(expected);
    });
  });
});
