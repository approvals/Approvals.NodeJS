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

/**
 * Allows you to provide overrides to the default configuration.
 * @param {*} overrideOptions
 */
var configure = function (overrideOptions) {
  cfg.configure(overrideOptions);
  return module.exports;
};

var getConfig = function(overrideOptions) {
  return cfg.getConfig(overrideOptions);
}

var scrubbers = require('./Scrubbers');

/**
 * Configure approvals to hook into Mocha tests.
 * @param {*} optionalBaseDir - An optional folder to save approval files to.
 */
var mochaExport = function (optionalBaseDir) {

  // if not providing a base dir, fallback to the current calling code's directory
  if (!optionalBaseDir) {
    optionalBaseDir = path.dirname(callsite()[1].getFileName());
  }

  var Namer = require("./Providers/Mocha/MochaNamer.js");
  var baseVerifier = require("./Providers/BeforeEachVerifierBase.js");

  baseVerifier(Namer, "require('Approvals').mocha();", optionalBaseDir);

  return module.exports;
};

var jasmineExport = function () {
  throw new Error("Aww shucks.\n\nApprovals support of Jasmine has been completely yanked out (don't shoot). \n\n Jasmine has grown quite complicated (behind our back) and we haven't had enough time to figure out a solid integration pattern... for now it's support has been removed.\n\n Check out the docs for manual usage of approval tests to work around the missing Jasmine integration (it should be a straightforward change for you, really).\n\n We'll consider bringing it back if we can get someone with interest in submitting a pull request that can bring it back...")
};

// Only export the MultiReporter due to performance - and you can
// pass any reporter into the multireporter using string or oject syntax (per the docs)
var reportersExport = {
  MultiReporter: require('./Reporting/Reporters/multiReporter')
}

var verifyAndScrub = function (dirName, testName, data, scrubber, optionsOverride) {

  scrubber = scrubber || scrubbers.noScrubber;

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

var verify = function (dirName, testName, data, optionsOverride) {
  return verifyAndScrub(dirName, testName, data, null, optionsOverride);
};

var verifyAsJSON = function (dirName, testName, data, optionsOverride) {
  return verifyAsJSONAndScrub(dirName, testName, data, null, optionsOverride);
};

var verifyAsJSONAndScrub = function (dirName, testName, data, scrubber, optionsOverride) {
  return verifyAndScrub(dirName, testName, JSON.stringify(data, null, '  '), scrubber, optionsOverride);
};


module.exports = {
  configure: configure,
  getConfig: getConfig,

  verify: verify,
  verifyAndScrub: verifyAndScrub,

  verifyAsJSON: verifyAsJSON,
  verifyAsJSONAndScrub: verifyAsJSONAndScrub,

  mocha: mochaExport,
  jasmine: jasmineExport,

  reporters: reportersExport,
  scrubbers: scrubbers

}
