'use strict';

var _ = require('lodash');
var DiffReporterAggregate = require('./DiffReporterAggregate');

var loadReporter = function (name) {

  if (_.isArray(name)) {
    var reporters = loadAllReporters(name);
    return new DiffReporterAggregate(reporters);
  }

  name = name.toLowerCase();

  var ReporterCtor;
  try {
    ReporterCtor = require("./Reporters/" + name + "Reporter.js");
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

    throw new Error("Error loading reporter or reporter not found [" + name + "]. Try one of the following [" + availableReporters + "]. Original Error: " + e);
  }
  return new ReporterCtor();
};

var loadAllReporters = function (reporters) {
  var reporterInstances = [];
  function throwUnknownReporterError(reporter) {
    throw new Error('Unknown reporter: typeof= [' + (typeof reporter) + ']. Reporters are either a string like "gitdiff" or an object that conforms to the custom reporter interface.');
  }

  reporters.forEach(function (reporter) {

    if (typeof reporter === "object") {

      if (reporter.canReportOn && typeof reporter.canReportOn === "function" &&
        reporter.report && typeof reporter.report === "function") {
        reporterInstances.push(reporter);
      } else {
        throwUnknownReporterError(reporter);
      }

    } else if (typeof reporter === "string") {
      var reporterInstance = loadReporter(reporter);
      reporterInstances.push(reporterInstance);
    } else {
      throwUnknownReporterError(reporter);
    }
  });

  return reporterInstances;
};

module.exports = {
  loadAllReporters: loadAllReporters,
  loadReporter: loadReporter
};
