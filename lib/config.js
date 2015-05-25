var userHome = require('user-home');
var fs = require('fs');
var path = require('path');
var _ = require("lodash");
var yaml = require('js-yaml');

var defaultConfig = {
  reporters: [
    "opendiff",
    "p4merge",
    "tortoisemerge",
    "nodediff",
    "gitdiff"
  ],
  appendEOL: true,
  EOL: require('os').EOL,
  errorOnStaleApprovedFiles: true,
  shouldIgnoreStaleApprovedFile: function() { return false; },
  stripBOM: false
};

var currentConfigObj = _.defaults({}, defaultConfig);

var getHomeApprovalConfig = function() {
  var homeConfigPath = path.join(userHome, '.approvalsConfig');
  if (fs.existsSync(homeConfigPath)) {

    // Get document, or throw exception on error
    var configFileData = fs.readFileSync(homeConfigPath).toString();
    try {
      return yaml.safeLoad(configFileData);
    } catch (ex) {
      throw "Error parsing " + homeConfigPath + ". " + ex;
    }
  }
  return null;
};

var getConfig = function(configOverrides) {
  var homeConfig = getHomeApprovalConfig() || {};
  var resultConfig = _.defaults(configOverrides || {}, homeConfig, defaultConfig);
  return resultConfig;
};

var configure = function(overrideOptions) {
  currentConfigObj = getConfig(overrideOptions);
  return currentConfigObj;
};

var currentConfig = function() {
  return currentConfigObj;
};

currentConfigObj = getConfig();

module.exports = {
  getConfig: getConfig,
  getHomeApprovalConfig: getHomeApprovalConfig,
  defaultConfig: defaultConfig,
  configure: configure,
  currentConfig: currentConfig
};
