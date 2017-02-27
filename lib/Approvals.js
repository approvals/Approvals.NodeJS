'use strict';
/*jshint freeze:false */

var _ = require("lodash");
var cfg = require('./config');
var callsite = require('callsite');
var path = require('path');
var postRunCleanup = require('./postRunCleanup');

// if someone tries to call 'require("approvals")...' without calling ".mocha(...) or .
// jasmine(...) they won't get a helpful error. So we put this in there - just in case"
if (typeof beforeEach === "function") {
  beforeEach(function () {
    this.verify = function () {
      throw new Error("You must call either .mocha() or .jasmine()");
    };
  });
}

// keep track of approved files we run into with tests
var listOfApprovedFiles = [];
process.on("approvalFileApproved", function (fileName) {
  if (listOfApprovedFiles.indexOf(fileName) === -1) {
    listOfApprovedFiles.push(fileName);
  }
});

process.on('exit', function () {
  var options = cfg.currentConfig();
  postRunCleanup(options, listOfApprovedFiles);
});

exports.configure = function (overrideOptions) {
  cfg.configure(overrideOptions);
  return exports;
};

exports.mocha = function (optionalBaseDir) {

  // if not providing a base dir, fallback to the current calling code's directory
  if (!optionalBaseDir) {
    optionalBaseDir = path.dirname(callsite()[1].getFileName());
  }

  var Namer = require("./Providers/Mocha/MochaNamer.js");
  var baseVerifier = require("./Providers/BeforeEachVerifierBase.js");

  baseVerifier(Namer, "require('Approvals').mocha();", optionalBaseDir);

  return exports;
};

exports.jasmine = function (optionalBaseDir) {

  // if not providing a base dir, fallback to the current calling code's directory
  if (!optionalBaseDir) {
    optionalBaseDir = path.dirname(callsite()[1].getFileName());
  }

  var Namer = require("./Providers/Jasmine/JasmineNamer.js");
  var baseVerifier = require("./Providers/BeforeEachVerifierBase.js");

  baseVerifier(Namer, "require('Approvals').jasmine();", optionalBaseDir);

  return exports;
};

exports.verify = function (dirName, testName, data, optionsOverride) {

  // backwards compatible option
  if (_.isArray(optionsOverride)) {
    optionsOverride = {
      reporters: optionsOverride
    };
    var stringReporters = JSON.stringify(optionsOverride.reporters);
    console.error("For the last arg of the approvals.verify(...) function, if you passed in an array of reporters, something like [\"opendiff\",\"nodediff\"], this has been deprecated and replaced by passing in a config object. Please re-evaluate if you can remove this parameter alltogether and use individual user configs in ~/.approvalConfig, if not then replace this: " + stringReporters + " with this { reporters: " + stringReporters + "}.");
  }

  var newOptions = cfg.configure(optionsOverride);
  var ManualNamer = require('./ManualNamer');
  var StringWriter = require("./StringWriter");
  var BinaryWriter = require('./Writers/BinaryWriter');
  var FileApprover = require("./FileApprover");
  var ReporterFactory = require("./Reporting/ReporterFactory");

  var namer = new ManualNamer(dirName, testName);
  var reporterFactory = function () {
    return [ReporterFactory.loadReporter(newOptions.reporters)];
  };

  var writer;
  if (data instanceof Buffer) {
    writer = new BinaryWriter(newOptions, data);
  } else {
    writer = new StringWriter(newOptions, data);
  }
  FileApprover.verify(namer, writer, reporterFactory, newOptions);
};

exports.verifyAsJSON = function (dirName, testName, data, optionsOverride) {
  exports.verify(dirName, testName, JSON.stringify(data, null, '  '), optionsOverride);
};
