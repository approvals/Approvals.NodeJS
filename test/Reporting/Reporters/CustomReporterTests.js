
var assert = require('assert');
var MyCustomReporter = function () {
  var wasReporterUsed = false;
  return {
    canReportOn: function(/*file*/){
      return true;
    },
    report: function(/*approved, received*/){
      wasReporterUsed = true;
    },
    getWasReporterUsed: function(){
      return wasReporterUsed;
    },
    name: "globalCustomReporter"
  };
};

var globalCustomReporter = new MyCustomReporter();

require('../../../lib/Approvals').configure({
  reporters: [globalCustomReporter],
  errorOnStaleApprovedFiles: false
}).mocha(__dirname);

describe("CustomReporter", function  () {
  it("allows CustomReporter at method level", function  () {

    var calledCustomReporter = false;

    try {
      this.verify('foo', {
        canReportOn: function(/*file*/){
          return true;
        },
        report: function(/*approved, received*/){
          calledCustomReporter = true;
        }
      });

    } catch (err) {
    }

    assert.ok(calledCustomReporter);
  });

  it("uses global custom reporter", function(){

    try {
      this.verify('foo');
    } catch (err) {

    }

    assert.ok(globalCustomReporter.getWasReporterUsed());
  });

  it("uses global custom reporter 2", function(){

    var reporter = this.approvals.getCurrentReporter();

    assert.equal(reporter.name, "DiffReporterAggregate [globalCustomReporter]");
  });

});
