//icdiff test\Reporters\a.txt test\Reporters\b.txt

var assert = require("assert");
var path = require("path");
var ReporterUnderTest = require("../../lib/Reporters/icdiffReporter.js");

describe('Reporter', function () {
  describe('icdiff', function () {
    it('reporter args are correct', function () {

      var reporter = new ReporterUnderTest();

      var approved = path.join(__dirname, "a.txt");
      var received = path.join(__dirname, "b.txt");

      var expectedCommand = "'icdiff' '" + received + "' '" + approved + "'";

      reporter.report(approved, received, function (command) {

        var startTrim = command.indexOf("icdiff");
        command = "'" + command.substr(startTrim);

        assert.equal(command, expectedCommand);
        return {};
      });
    });

  });
});
