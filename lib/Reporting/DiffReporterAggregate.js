'use strict';

var DiffReporterAggregate = function (reporters) {
  this.reporters = reporters;
  this.name = "DiffReporterAggregate [" + reporters.map(function (item) { return item.name; }).join(', ') + "]";
};

DiffReporterAggregate.prototype.getReporter = function (file) {
  var firstReporter = null;
  var reporters = this.reporters;

  for (var i = 0; i < reporters.length; i++) {
    var reporter = reporters[i];
    if (reporter.canReportOn(file)) {
      firstReporter = reporter;
      break;
    }
  }
  return firstReporter;
};

DiffReporterAggregate.prototype.canReportOn = function (file) {
  return !!this.getReporter(file);
};

DiffReporterAggregate.prototype.report = function (approved, received, execCmd) {
  var reporter = this.getReporter(received);

  if (reporter) {
    reporter.report(approved, received, execCmd);
  } else {
    throw new Error("No reporter found!");
  }
};

module.exports = DiffReporterAggregate;
