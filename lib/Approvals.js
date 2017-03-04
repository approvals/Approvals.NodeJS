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

/**
 * Allows the creation of an approvals configuration object using any passed in options to override the defaults.
 * @param {Object} overrideOptions
 * @returns {Object} approvals config object with any options overridden.
 */
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

var reportersExport = {

  /**
   * This allows access to the MultiReporter constructor.
   * You can use this to run multiple reporters at the same dime.
   *
   * @example
   * approvals.verify(__dirname, "multi-reporter-example", "some data", {
   *   reporters: [
   *     new MultiReporter('p4merge', 'copycommand')
   *   ]
   * });
   */
  MultiReporter: require('./Reporting/Reporters/multiReporter')
}

/**
 * Use this to apply the scrubber function to any data before running verify.
 *
 * @param {string} dirName - Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files.
 * @param {string} testName - A file name save string to call the file associated with this test.
 * @param {(string|Buffer)} data - Either the string to save as a text file or a Buffer that represents an image
 * @param {*} scrubber - An function that takes a string and returns a string. Approvals will call this if it exists to scrub the "data" before writing to any files.
 * @param {*} optionsOverride - an object that can contain configurational overrides as defined in the approvals configuration object.
 */
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

/**
 *
 * @param {string} dirName - Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files.
 * @param {string} testName - A file name save string to call the file associated with this test.
 * @param {(string|Buffer)} data - Either the string to save as a text file or a Buffer that represents an image
 * @param {*} optionsOverride - an object that can contain configurational overrides as defined in the approvals configuration object.
 */
var verify = function (dirName, testName, data, optionsOverride) {
  return verifyAndScrub(dirName, testName, data, null, optionsOverride);
};

/**
 * You can pass as "data" any javascript object to be JSON.stringified and run verify against.
 * @param {string} dirName - Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files.
 * @param {string} testName - A file name save string to call the file associated with this test.
 * @param {(string|Buffer)} data - This can be any JavaScript object/array that will be JSON.stringified before running verify
 * @param {*} optionsOverride - an object that can contain configurational overrides as defined in the approvals configuration object.
 */
var verifyAsJSON = function (dirName, testName, data, optionsOverride) {
  return verifyAsJSONAndScrub(dirName, testName, data, null, optionsOverride);
};

/**
 * You can pass as "data" any javascript object to be JSON.stringified. Before we run verify the scrubber will be run against the complete string before running verify against it.
 *
 * @param {string} dirName - Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files.
 * @param {string} testName - A file name save string to call the file associated with this test.
 * @param {(string|Buffer)} data - This can be any JavaScript object/array that will be JSON.stringified before running verify
 * @param {*} scrubber - An function that takes a string and returns a string. Approvals will call this if it exists to scrub the "data" before writing to any files.
 * @param {*} optionsOverride - an object that can contain configurational overrides as defined in the approvals configuration object.
 */
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
