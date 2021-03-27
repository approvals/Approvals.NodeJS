'use strict';

var userHome = require('user-home');
var fs = require('fs');
var path = require('path');
var _ = require("lodash");
var yaml = require('js-yaml');
var reportingLaunchingCircuitBreaker = require('./Reporting/ReportLaunchingCircuitBreaker');

var defaultConfig = {
  // The strategy for determining which reporter to use will likely
  // change at some point. For now, you can configure priority here.
  // What I'd prefer is if each project has a configuration file
  // and each user could setup a ~/.approvalConfig file
  // which would contain their preferred merge/diff tools
  reporters: [
    "opendiff",
    "p4merge",
    "tortoisemerge",
    "nodediff",
    "gitdiff",
    /* OR a custom reporter object. See the above example of how to create a custom reporter. */
  ],

  // If you need to normalize text file line-endings
  // you can set this to something like "\n" or "\r\n"
  //
  // default value here of false or undefined will not apply any
  // line-ending replacement before writing the approval received file
  normalizeLineEndingsTo: false, // default

  // If approvals determines things are different, it will replacement
  // line endings CRLF with just LF and re-compare. If they are the same
  // approvals will log a warning that the files are the same except for
  // line endings. Flip this to `true` to fail tests if line-endings
  // are different
  failOnLineEndingDifferences: false,

  // Some diff tools automatically append an EOL to a merge file
  // Setting this to true helps with those cases... (Also see EOL below
  // for what is appended)
  appendEOL: true,

  // When appendEOL above is true, this value defines what will be appended at the end of the file.
  // It's really a bad name as it's not End-of-Line... but -end-of-file err end-of-line-at-end-of-file :P
  EOL:  require('os').EOL,

  // This helps keep the project clean of files
  // that became stale due to removal of tests
  // or after a rename
  errorOnStaleApprovedFiles: true,

  // This is a function called when the proc is exiting and we're
  // validating any stale *.approved.txt files. You can override
  // this function to ignore validation of some files or not
  shouldIgnoreStaleApprovedFile: function(/*fileName*/) { return false; },

  // On some files or projects a Byte Order
  // Mark can be inserted and cause issues,
  // this allows you to force it to be stripped
  stripBOM: false,

  //DANGER: this can be used to force-approve a file during a test run.
  // Can be used for first time-run or if lots of tests are failing because
  // of a change you know is correct. AGAIN DANGER - don't ever check code
  // in that configures this to be on...)
  forceApproveAll: false,

  // Default to `false` - launching each diff tool in the background, failing the test and
  // moving on to the next test. If `true` will launch the diff tool and block/wait (if diff tool supports this) until
  // the user exits the diff tool before continuing on with the rest of the tests.
  blockUntilReporterExits: false,

  // The number of reporters (diff tools) launched before before approval tests stops launching new reporters.
  // This is to avoid overloading a system with too many processes.
  // NOTE: This value is only used if `blockUntilReporterExits` is `false`.
  maxLaunches: 10

};

var getHomeApprovalConfig = function () {
  var homeConfigPath = path.join(userHome, '.approvalsConfig');
  if (fs.existsSync(homeConfigPath)) {

    // Get document, or throw exception on error
    var configFileData = fs.readFileSync(homeConfigPath).toString();
    try {
      return yaml.load(configFileData);
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

  processConfig(currentConfigObj);

  return currentConfigObj;
};

var currentConfig = function () {
  return currentConfigObj;
};

var reset = function () {
  currentConfigObj = _.defaults({}, getHomeApprovalConfig(), defaultConfig)
};

currentConfigObj = getConfig();


function processConfig(config) {
  if (config.maxLaunches) {
    reportingLaunchingCircuitBreaker.setMaxLaunch(config.maxLaunches);
  }
}

module.exports = {
  getConfig: getConfig,
  getHomeApprovalConfig: getHomeApprovalConfig,
  defaultConfig: defaultConfig,
  configure: configure,
  currentConfig: currentConfig,
  reset: reset
};
