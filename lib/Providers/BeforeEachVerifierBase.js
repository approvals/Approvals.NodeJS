/*global beforeEach */
var _ = require('lodash');
var fs = require('fs');
var config = require('../config');
var StringWriter = require("../StringWriter.js");
var FileApprover = require("../FileApprover.js");
var ReporterFactory = require("../Reporting/ReporterFactory.js");

module.exports = function (Namer, usageSample, dirName) {

  if (!dirName) {
    throw "'dirName' parameter not found. Try using the following syntax. > " + usageSample;
  }

  // Make sure it's a valid directory
  var stats = fs.lstatSync(dirName);
  if (!stats.isDirectory()) {
    throw "Invalid directory [" + dirName + "]. Try using the following syntax. > " + usageSample;
  }

  beforeEach(function () {
    var context = Namer.getContext.call(this);
    var namer = new Namer(context, dirName);

    var approvalsExtras = {
      namer: namer,
      getCurrentReporter: function(options) {
        options = options || config.currentConfig();
        var reporter = ReporterFactory.loadAllReporters(options.reporters);
        return reporter[0];
      }
    };

    // Tack on an approvals property so we can add on some
    // helper approvals goo this is mostly used for the test.
    this.approvals = approvalsExtras;

    this.verify = function (data, overrideOptions) {
      var newOptions = _.defaults(overrideOptions || {}, config.currentConfig());

      var reporterFactory = function() {
        return approvalsExtras.getCurrentReporter(newOptions);
      };

      var writer = new StringWriter(newOptions, data);
      FileApprover.verify(namer, writer, reporterFactory);
    };

    this.verifyAsJSON = function (data, overrideOptions) {
      this.verify(JSON.stringify(data, null, '  '), overrideOptions);
    };

  });
};
