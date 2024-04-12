'use strict';

var DiffReporterAggregate = require('./DiffReporterAggregate');

var loadReporter = function (name) {

  if (Array.isArray(name)) {
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

var throwUnknownReporterError = function(reporter) {
  throw new Error('Unknown reporter: typeof= [' + (typeof reporter) + ']. Reporters are either a string like "gitdiff" or an object that conforms to the custom reporter interface.');
}

var assertValidReporter = function (reporter) {

  if (typeof reporter.name !== 'string') {
    console.error('invalid reporter', reporter);
    throw new Error('A valid reporter should have a \'name\' property. EX: { name: "my-custom-reporter" }');
  }

  if (typeof reporter.canReportOn !== 'function') {
    console.error('invalid reporter', reporter);
    throw new Error('A valid reporter should have a \'{ canReportOn: function(fileName) { return true; // Example } \' function');
  }

  if (typeof reporter.report !== 'function') {
    console.error('invalid reporter', reporter);
    throw new Error('A valid reporter should have a \' { report: function (approvedFilePath, receivedFilePath) {...} }\' function');
  }

  return true;
}

var loadAllReporters = function (reporters) {
  var reporterInstances = [];

  reporters.forEach(function (reporter) {

    if (typeof reporter === "object") {

      assertValidReporter(reporter);
      reporterInstances.push(reporter);

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
  loadReporter: loadReporter,
  assertValidReporter: assertValidReporter
};
