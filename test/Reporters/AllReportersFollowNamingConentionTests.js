var fs = require('fs');
var assert = require('assert');

var allReporterFiles = [];
describe('All reporters must conform to naming convention', function () {
  beforeEach(function () {
    fs.readdirSync(__dirname + "/../../lib/Reporters")
      .forEach(function (file) {
        if (file.indexOf("Reporter.js") > -1) {
          allReporterFiles.push(file);
        }
      });
  });

  it("should have some reporters", function () {
    assert.ok(allReporterFiles.length, "should have found some file");
  });

  it("should all have prefix names lower case", function () {
    allReporterFiles.forEach(function (item) {
      var prefix = item.replace("Reporter.js", "");
      assert.equal(prefix, prefix.toLowerCase());
    });
  });
});
