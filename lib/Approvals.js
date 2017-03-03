'use strict';
/*jshint freeze:false */

var cfg = require('./config');
var callsite = require('callsite');
var path = require('path');
var postRunCleanup = require('./postRunCleanup');

// if someone tries to call 'require("approvals")...' without calling ".mocha(...) or
// they won't get a helpful error. So we put this in there - just in case"
if (typeof beforeEach === "function") {
  beforeEach(function () {
    this.verify = function () {
      throw new Error("You must call either .mocha()");
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

exports.jasmine = function () {
  throw new Error("Aww shucks.\n\nApprovals support of Jasmine has been completely yanked out (don't shoot). \n\n Jasmine has grown quite complicated (behind our back) and we haven't had enough time to figure out a solid integration pattern... for now it's support has been removed.\n\n Check out the docs for manual usage of approval tests to work around the missing Jasmine integration (it should be a straightforward change for you, really).\n\n We'll consider bringing it back if we can get someone with interest in submitting a pull request that can bring it back...")
};

// Only export the MultiReporter due to performance - and you can
// pass any reporter into the multireporter using string or oject syntax (per the docs)
exports.reporters = {
  MultiReporter: require('./Reporting/Reporters/multiReporter')
}

exports.scrubbers = require('./Scrubbers');

exports.verifyAndScrub = function (dirName, testName, data, scrubber, optionsOverride) {

  scrubber = scrubber || exports.scrubbers.noScrubber;

  // backwards compatible option
  if (Array.isArray(optionsOverride)) {
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
    data = scrubber(data);

    writer = new StringWriter(newOptions, data);
  }
  FileApprover.verify(namer, writer, reporterFactory, newOptions);
};

exports.verify = function (dirName, testName, data, optionsOverride) {
  return exports.verifyAndScrub(dirName, testName, data, null, optionsOverride);
};

exports.verifyAsJSON = function (dirName, testName, data, optionsOverride) {
  exports.verifyAsJSONAndScrub(dirName, testName, data, null, optionsOverride);
};

exports.verifyAsJSONAndScrub = function (dirName, testName, data, scrubber, optionsOverride) {
  exports.verifyAndScrub(dirName, testName, JSON.stringify(data, null, '  '), scrubber, optionsOverride);
};
