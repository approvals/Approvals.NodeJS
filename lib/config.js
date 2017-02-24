'use strict';

var userHome = require('user-home');
var fs = require('fs');
var path = require('path');
var _ = require("lodash");
var yaml = require('js-yaml');

var defaultConfig = {
  // The strategy for determining which reporter to use will likely
  // change at some point. For now, you can configure priority here.
  // What'd I'd prefer is if each project has a configuraiton file
  // and each user could setup a ~/.approvalConfig file
  // which would contain their preferred merge/diff tools
  reporters: [
    "opendiff",
    "p4merge",
    "tortoisemerge",
    "nodediff",
    "gitdiff"

    /* OR a custom reporter object. Below describes the reporter object interface:

      // If you want to provide a custom reporter
      // you can't do this with the config yml file
      // but can be passed anywhere a config object is accepted
      // and must have the following interface
      {

        // This is used to determine if the reporter can report on the specified file
        // EX: an image differ vs a txt differ...
        canReportOn(receivedFilePath: string): boolean;

        // Actually execute the diff against the two files
        report(approvedFilePath: string, receivedFilePath: string): void;
      }
    */
  ],

  // If you need to normalize text file line-endings
  // you can set this to something like "\n" or "\r\n"
  //
  // default value here of false or undefined will not apply any
  // line-ending replacement beforw writing the approval received file
  normalizeLineEndingsTo: false, // default

  // Some diff tools automatically append an EOL to a merge file
  // Setting this to true helps with those cases...
  appendEOL: true,

  EOL: require('os').EOL,

  // This helps keep the project clean of files
  // that became stale due to removal of tests
  // or after a rename
  errorOnStaleApprovedFiles: true,

  // This is a function called when the proc is exiting and we're
  // validating any stale *.approved.txt files. You can override
  // this function to ignore validation of some files or not
  shouldIgnoreStaleApprovedFile: function (/*fileName*/) { return false; },

  // On some files or projects a Byte Order
  // Mark can be inserted and cause issues,
  // this allows you to force it to be stripped
  stripBOM: false,

  failOnLineEndingDifferences: false,

  //DANGER: this can be used to force-approve a file during a test run.
  // Can be used for first time-run or if lots of tests are failing because
  // of a change you know is correct. AGAIN DANGER - don't ever check code
  // in that configures this to be on...)
  forceApproveAll: false
};

var getHomeApprovalConfig = function () {
  var homeConfigPath = path.join(userHome, '.approvalsConfig');
  if (fs.existsSync(homeConfigPath)) {

    // Get document, or throw exception on error
    var configFileData = fs.readFileSync(homeConfigPath).toString();
    try {
      return yaml.safeLoad(configFileData);
    } catch (ex) {
      throw new Error("Error parsing " + homeConfigPath + ". " + ex);
    }
  }
  return null;
};

var currentConfigObj;

var getConfig = function (configOverrides) {
  var homeConfig = getHomeApprovalConfig() || {};
  var resultConfig = _.defaults(configOverrides || {}, currentConfigObj || {}, homeConfig, defaultConfig);
  return resultConfig;
};

var configure = function (overrideOptions) {
  currentConfigObj = getConfig(overrideOptions);
  return currentConfigObj;
};

var currentConfig = function () {
  return currentConfigObj;
};

var reset = function () {
  currentConfigObj = _.defaults({}, getHomeApprovalConfig(), defaultConfig)
};

currentConfigObj = getConfig();

module.exports = {
  getConfig: getConfig,
  getHomeApprovalConfig: getHomeApprovalConfig,
  defaultConfig: defaultConfig,
  configure: configure,
  currentConfig: currentConfig,
  reset: reset
};
