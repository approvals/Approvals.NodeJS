var _ = require('underscore');
var DiffReporterAggregate = require('./DiffReporterAggregate');

var loadReporter = function (name) {

  if (_.isArray(name)) {
    var reporters = loadAllReporters(name);
    return new DiffReporterAggregate(reporters);
  }

  name = name.toLowerCase();

  var reporter;
  try {
    reporter = require("./" + name + "Reporter.js");
  } catch (e) {

    var allFiles = require('fs').readdirSync(__dirname);
    var availableReporters = "";

    allFiles.forEach(function (item) {
      if (item.indexOf("Reporter.js") > 0) {
        if (availableReporters) {
          availableReporters += ", ";
        }
        availableReporters += item.replace("Reporter.js", '');
      }
    });

    throw "Reporter not found [" + name + "]. Try one of the following [" + availableReporters + "]";
  }
  return new reporter();
};

var loadAllReporters = function (reporters) {
  var reporterInstances = [];

  reporters.forEach(function (reporter) {

    if (typeof reporter === "object") {

      if (reporter.canReportOn && typeof reporter.canReportOn === "function" &&
        reporter.report && typeof reporter.report === "function") {
        // TODO: verify that an instance of the ctor function has 'canReportOn, report' functions
        reporterInstances.push(reporter);
      }
    } else if (typeof reporter === "string") {
      var ctorFun = loadReporter(reporter);
      reporterInstances.push(ctorFun);
    } else {
      throw 'Unknown reporter: typeof= [' + (typeof reporter) + ']. Reporters are either a string like "gitdiff" or an object that conforms to the custom reporter interface.';
    }
  });

  return reporterInstances;
};

module.exports = {
  loadAllReporters: loadAllReporters,
  loadReporter: loadReporter
};
