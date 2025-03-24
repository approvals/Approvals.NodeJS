/*jshint freeze:false */

/**
 * Approvals module.
 * @module approvals
 */

import callsite from "callsite";
import path from "path";
import { fileURLToPath } from "url";
import * as cfg from "./config";
import { BinaryWriter } from "./Writers/BinaryWriter";
import { FileApprover } from "./FileApprover";
import { FinalMessages } from "./FinalMessages";
import { ManualNamer } from "./ManualNamer";
import { Namer } from "./Core/Namer";
import { ReporterFactory, ReporterLoader } from "./Reporting/ReporterFactory";
import { Scrubber, Scrubbers } from "./Scrubbers/Scrubbers";
import { StringWriter } from "./StringWriter";
import { Writer } from "./Core/Writer";
import { postRunCleanup } from "./postRunCleanup";
import { stringifyKeysInOrder } from "./AUtils";

// if someone tries to call 'require("approvals")...' without calling ".mocha(...) or
// they won't get a helpful error. So we put this in there - just in case"
import { MochaNamer } from "./Providers/Mocha/MochaNamer";

import { beforeEachVerifierBase } from "./Providers/BeforeEachVerifierBase";

/**
 * Contains some helpful and util scrubbers that can be used for scrubbing data before saving to a received file.
 */
export { Scrubbers as scrubbers };

if (typeof beforeEach === "function") {
  beforeEach(function (this: any): void {
    if (!this) {
      return;
    }
    this.verify = function () {
      throw new Error("You must call either .mocha()");
    };
  });
}

// keep track of approved files we run into with tests
const listOfApprovedFiles: string[] = [];
process.on("approvalFileApproved", function (fileName): void {
  if (listOfApprovedFiles.indexOf(fileName) === -1) {
    listOfApprovedFiles.push(fileName);
  }
});

process.on("exit", function (): void {
  const options = cfg.currentConfig();
  postRunCleanup(options, listOfApprovedFiles);
  const finalMessages = FinalMessages.getMessages();
  if (finalMessages.length) {
    console.log("******************************");
    console.log("* Approvals Report: WARNING!");
    finalMessages.forEach((message: string) => {
      console.log(`*  - ${message}`);
    });
    console.log("******************************");
  }
});

/**
 * Allows you to provide overrides to the default configuration.
 *
 * @example
 * const approvals = require('approvals');
 * approvals.configure({
 *   reporters: ['p4merge']
 * });
 *
 * @param {*} overrideOptions
 */
export function configure(overrideOptions: cfg.Config): typeof module.exports {
  cfg.configure(overrideOptions);
  return module.exports;
}

/**
 * Allows the creation of an approvals configuration object using any passed in options to override the defaults.
 * @param {Object} overrideOptions
 * @returns {Object} approvals config object with any options overridden.
 */
export function getConfig(overrideOptions?: cfg.Config): cfg.Config {
  return cfg.getConfig(overrideOptions);
}

/**
 * Configure approvals to hook into Mocha tests.
 * @param {*} optionalBaseDir - An optional folder to save approval files to.
 */

export function mocha(optionalBaseDir?: string): typeof module.exports {
  // if not providing a base dir, fallback to the current calling code's directory
  if (!optionalBaseDir) {
    let fileName = callsite()[1].getFileName();
    if (fileName.startsWith("file://")) {
      fileName = fileURLToPath(fileName);
    }
    optionalBaseDir = path.dirname(fileName);
  }
  beforeEachVerifierBase(
    MochaNamer,
    "require('Approvals').mocha();",
    optionalBaseDir,
  );

  return module.exports;
}

function jasmineExport(): void {
  throw new Error(
    "Aww shucks.\n\nApprovals support of Jasmine has been completely yanked out (don't shoot). \n\n Jasmine has grown quite complicated (behind our back) and we haven't had enough time to figure out a solid integration pattern... for now it's support has been removed.\n\n Check out the docs for manual usage of approval tests to work around the missing Jasmine integration (it should be a straightforward change for you, really).\n\n We'll consider bringing it back if we can get someone with interest in submitting a pull request that can bring it back...",
  );
}

/**
 * `reporters` gives access to the `MultiReporter`
 *
 * @example
 * const MultiReporter = approvals.reporters.MultiReporter
 */

export const reporters: { MultiReporter: any } = {
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
  MultiReporter: require("./Reporting/Reporters/multiReporter").default,
};

/**
 * Use this to apply the scrubber function to any data before running verify.
 *
 * @example
 * // basic approval test with a custom scrubber
 * const approvals = require('approvals');
 * const scrubber = approvals.scrubbers.multiScrubber([
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
function verifyAndScrub(
  dirName: string,
  testName: string,
  data: BinaryWriter | string,
  scrubber: Scrubber,
  optionsOverride: any,
): void {
  scrubber = scrubber || Scrubbers.noScrubber;

  // backwards compatible option
  if (Array.isArray(optionsOverride)) {
    optionsOverride = {
      reporters: optionsOverride,
    };
    const stringReporters = JSON.stringify(optionsOverride.reporters);
    console.error(
      'For the last arg of the approvals.verify(...) function, if you passed in an array of reporters, something like ["opendiff","nodediff"], this has been deprecated and replaced by passing in a config object. Please re-evaluate if you can remove this parameter alltogether and use individual user configs in ~/.approvalConfig, if not then replace this: ' +
        stringReporters +
        " with this { reporters: " +
        stringReporters +
        "}.",
    );
  }

  const newOptions = cfg.getConfig(optionsOverride);

  const namer = new ManualNamer(dirName, testName);

  let writer: Writer;
  if (data instanceof Buffer) {
    writer = new BinaryWriter(newOptions, data);
  } else {
    data = scrubber(data as string);

    writer = new StringWriter(newOptions, data as string);
  }
  verifyWithControl(namer, writer, null, newOptions);
}
/**
 *
 * @example
 * // basic approval test
 * const approvals = require('approvals');
 * approvals.verify(__dirname, 'sample-approval-test', "some text to verify");
 *
 * @example
 * // basic approval test providing an option to override configuration
 * const approvals = require('approvals');
 * approvals.verify(__dirname, 'sample-approval-test', "some text to verify", { normalizeLineEndingsTo: true });
 *
 * @param {string} dirName - Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files.
 * @param {string} testName - A file name save string to call the file associated with this test.
 * @param {(string|Buffer)} data - Either the string to save as a text file or a Buffer that represents an image
 * @param {*} optionsOverride - An object that can contain configurational overrides as defined in the approvals configuration object.
 */

export function verify(
  dirName: string,
  testName: string,
  data: any,
  optionsOverride?: any,
): void {
  return verifyAndScrub(
    dirName,
    testName,
    data,
    Scrubbers.noScrubber,
    optionsOverride,
  );
}

/**
 * You can pass as "data" any javascript object to be JSON.stringified and run verify against.
 *
 * @example
 * const approvals = require('approvals');
 * approvals.verifyAndScrub(__dirname, 'sample-approval-test', { a: "some text in an object" });
 *
 * @param {string} dirName - Typically `__dirname` but could be the base-directory (anywhere) to store both approved and received files.
 * @param {string} testName - A file name safe string to call the file associated with this test.
 * @param {(string|Buffer)} data - This can be any JavaScript object/array that will be JSON.stringified before running verify
 * @param {*} optionsOverride - An object that can contain configurational overrides as defined in the approvals configuration object.
 */
export function verifyAsJSON(
  dirName: string,
  testName: string,
  data: any,
  optionsOverride: any,
) {
  return verifyAsJSONAndScrub(
    dirName,
    testName,
    data,
    Scrubbers.noScrubber,
    optionsOverride,
  );
}

/**
 * You can pass as "data" any javascript object to be JSON.stringified. Before we run verify the scrubber will be run against the complete string before running verify against it.

 * @example
 * // basic approval test with a custom scrubber
 * const approvals = require('approvals');
 * const scrubber = approvals.scrubbers.multiScrubber([
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

export function verifyAsJSONAndScrub(
  dirName: string,
  testName: string,
  data: any,
  scrubber: Scrubber,
  optionsOverride: any,
): void {
  return verifyAndScrub(
    dirName,
    testName,
    stringifyKeysInOrder(data),
    scrubber,
    optionsOverride,
  );
}

/**
 * This allows you to take full control of naming and writing files before verifying.
 *
 * For an example that we use to generate the docs within the readme, check out the [test/readmeTests.mts](test/readmeTests.mts) in this project.
 *
 * @param {Object} namer
 * @param {Object} writer
 * @param {Function} [reporterFactory]
 * @param {Object} [optionsOverride]
 */

export function verifyWithControl(
  namer: Namer,
  writer: Writer,
  reporterFactory?: ReporterLoader | null,
  optionsOverride?: Partial<cfg.Config>,
) {
  const newOptions = cfg.getConfig(optionsOverride);

  const loader =
    (reporterFactory as ReporterLoader) ||
    function () {
      return [ReporterFactory.loadReporter(newOptions.reporters)];
    };

  FileApprover.verify(namer, writer, loader, newOptions);
}
