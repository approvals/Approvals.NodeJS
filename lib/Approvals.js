'use strict';
/*jshint freeze:false */

/**
 * Approvals module.
 * @module approvals
 */


var cfg = require('./config');
var callsite = require('callsite');
var path = require('path');
var postRunCleanup = require('./postRunCleanup');
var ManualNamer = require('./ManualNamer');
var StringWriter = require("./StringWriter");
var BinaryWriter = require('./Writers/BinaryWriter');
var FileApprover = require("./FileApprover");
var ReporterFactory = require("./Reporting/ReporterFactory");
var aUtils = require('./AUtils');
var FinalMessages = require('./FinalMessages');


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

  const finalMessages = FinalMessages.getMessages();
  if (finalMessages.length) {
    console.log("******************************")
    console.log("* Approvals Report: WARNING!")

    finalMessages.forEach((message) => {
      console.log(`*  - ${message}`);
    });

    console.log("******************************")

  }

});

var configure = function (overrideOptions) {
  cfg.configure(overrideOptions);
  return module.exports;
};

var getConfig = function(overrideOptions) {
  return cfg.getConfig(overrideOptions);
}

var scrubbers = require('./Scrubbers');

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
   * You can use this to run multiple reporters at the same time.
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

  var namer = new ManualNamer(dirName, testName);

  var writer;
  if (data instanceof Buffer) {
    writer = new BinaryWriter(newOptions, data);
  } else {
    data = scrubber(data);

    writer = new StringWriter(newOptions, data);
  }
  verifyWithControl(namer, writer, null, newOptions);
};

var verify = function (dirName, testName, data, optionsOverride) {
  return verifyAndScrub(dirName, testName, data, null, optionsOverride);
};

var verifyAsJSON = function (dirName, testName, data, optionsOverride) {
  return verifyAsJSONAndScrub(dirName, testName, data, null, optionsOverride);
};

var verifyAsJSONAndScrub = function (dirName, testName, data, scrubber, optionsOverride) {
  return verifyAndScrub(dirName, testName, aUtils.stringifyKeysInOrder(data), scrubber, optionsOverride);
};

var verifyWithControl = function (namer, writer, reporterFactory, optionsOverride) {
  var newOptions = cfg.configure(optionsOverride);

  reporterFactory = reporterFactory || function () {
    return [ReporterFactory.loadReporter(newOptions.reporters)];
  };

  FileApprover.verify(namer, writer, reporterFactory, newOptions);
};

module.exports = {
  /**
   * Allows you to provide overrides to the default configuration.
   *
   * @example
   * var approvals = require('approvals');
   * approvals.configure({
   *   reporters: ['p4merge']
   * });
   *
   * @param {*} overrideOptions
   */
  configure: configure,

  /**
   * Allows the creation of an approvals configuration object using any passed in options to override the defaults.
   * @param {Object} overrideOptions
   * @returns {Object} approvals config object with any options overridden.
   */
  getConfig: getConfig,

  /**
   *
   * @example
   * // basic approval test
   * var approvals = require('approvals');
   * approvals.verify(__dirname, 'sample-approval-test', "some text to verify");
   *
   * @example
   * // basic approval test providing an option to override configuration
   * var approvals = require('approvals');
   * approvals.verify(__dirname, 'sample-approval-test', "some text to verify", { normalizeLineEndingsTo: true });
   *
   * @param {string} dirName - Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files.
   * @param {string} testName - A file name save string to call the file associated with this test.
   * @param {(string|Buffer)} data - Either the string to save as a text file or a Buffer that represents an image
   * @param {*} optionsOverride - An object that can contain configurational overrides as defined in the approvals configuration object.
   */
  verify: verify,

  /**
   * Use this to apply the scrubber function to any data before running verify.
   *
   * @example
   * // basic approval test with a custom scrubber
   * var approvals = require('approvals');
   * var scrubber = approvals.scrubbers.multiScrubber([
   *    function (data) {
   *      return (data || '').replace("some text", "some other text");
   *    },
   *    approvals.scrubbers.guidScrubber // to remove guids from the received data
   * });
   * approvals.verifyAndScrub(__dirname, 'sample-approval-test', "some text to verify", scrubber);
   *
   * @param {string} dirName - Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files.
   * @param {string} testName - A file name safe string to call the file associated with this test.
   * @param {(string|Buffer)} data - Either the string to save as a text file or a Buffer that represents an image
   * @param {*} scrubber - A function that takes a string and returns a string. Approvals will call this if it exists to scrub the "data" before writing to any files.
   * @param {*} optionsOverride - An object that can contain configurational overrides as defined in the approvals configuration object.
   */
  verifyAndScrub: verifyAndScrub,

  /**
   * You can pass as "data" any javascript object to be JSON.stringified and run verify against.
   *
   * @example
   * var approvals = require('approvals');
   * approvals.verifyAndScrub(__dirname, 'sample-approval-test', { a: "some text in an object" });
   *
   * @param {string} dirName - Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files.
   * @param {string} testName - A file name safe string to call the file associated with this test.
   * @param {(string|Buffer)} data - This can be any JavaScript object/array that will be JSON.stringified before running verify
   * @param {*} optionsOverride - An object that can contain configurational overrides as defined in the approvals configuration object.
   */
  verifyAsJSON: verifyAsJSON,

  /**
   * You can pass as "data" any javascript object to be JSON.stringified. Before we run verify the scrubber will be run against the complete string before running verify against it.

   * @example
   * // basic approval test with a custom scrubber
   * var approvals = require('approvals');
   * var scrubber = approvals.scrubbers.multiScrubber([
   *    function (data) {
   *      return (data || '').replace("some text", "some other text");
   *    },
   *    approvals.scrubbers.guidScrubber // to remove guids from the received data
   * });
   * approvals.verifyAndScrub(__dirname, 'sample-approval-test', { a: "some text in an object" }, scrubber);
   *
   * @param {string} dirName - Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files.
   * @param {string} testName - A file name safe string to call the file associated with this test.
   * @param {(string|Buffer)} data - This can be any JavaScript object/array that will be JSON.stringified before running verify
   * @param {*} scrubber - A function that takes a string and returns a string. Approvals will call this if it exists to scrub the "data" before writing to any files.
   * @param {*} optionsOverride - An object that can contain configurational overrides as defined in the approvals configuration object.
   */
  verifyAsJSONAndScrub: verifyAsJSONAndScrub,

  /**
   * This allows you to take full control of naming and writing files before verifying.
   *
   * For an example that we use to generate the docs within the readme, check out the [test/readmeTests.js](test/readmeTests.js) in this project.
   *
   * @param {Object} namer
   * @param {Object} writer
   * @param {Function} [reporterFactory]
   * @param {Object} [optionsOverride]
   */
  verifyWithControl: verifyWithControl,

  /**
   * Configure approvals to hook into Mocha tests.
   * @param {*} optionalBaseDir - An optional folder to save approval files to.
   */
  mocha: mochaExport,
  jasmine: jasmineExport,

  /**
   * `reporters` gives access to the `MultiReporter`
   *
   * @example
   * var MultiReporter = approvals.reporters.MultiReporter
   */
  reporters: reportersExport,

  /**
   * Contains some helpful and util scrubbers that can be used for scrubbing data before saving to a received file.
   */
  scrubbers: scrubbers

}
