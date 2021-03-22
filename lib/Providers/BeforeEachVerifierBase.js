'use strict';

var _ = require('lodash');
var fs = require('fs');
var cfg = require('../config');
var StringWriter = require("../StringWriter.js");
var FileApprover = require("../FileApprover.js");
var ReporterFactory = require("../Reporting/ReporterFactory.js");
var aUtils = require('../AUtils');

module.exports = function (Namer, usageSample, dirName) {

  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }

  // Make sure it's a valid directory
  var stats = fs.lstatSync(dirName);
  if (!stats.isDirectory()) {
    throw new Error("Invalid directory [" + dirName + "]. Try using the following syntax. > " + usageSample);
  }

  beforeEach(function () {

    var approvalsExtras = {
      getCurrentReporters: function (options) {
        options = options || cfg.currentConfig();
        var reporterCandidates = ReporterFactory.loadAllReporters(options.reporters);
        return reporterCandidates;
      }
    };

    // Tack on an approvals property so we can add on some
    // helper approvals goo this is mostly used for the test.
    this.approvals = approvalsExtras;

    this.verify = function (data, overrideOptions) {
      var namer = new Namer(this, dirName);

      var newOptions = _.defaults(overrideOptions || {}, cfg.currentConfig());

      var reporterFactory = function () {
        return approvalsExtras.getCurrentReporters(newOptions);
      };

      var writer = new StringWriter(newOptions, data);
      FileApprover.verify(namer, writer, reporterFactory);
    };

    this.verifyAsJSON = function (data, overrideOptions) {
      this.verify(aUtils.stringifyKeysInOrder(data), overrideOptions);
    };

  });
};
