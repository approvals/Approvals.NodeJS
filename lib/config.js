var userHome = require('user-home');
var fs = require('fs');
var path = require('path');
var _ = require("lodash");
var yaml = require('js-yaml');

var osTools = require("./osTools.js");

var defaultConfig = {
  reporters: [
    "opendiff",
    "p4merge",
    "tortoisemerge",
    "nodediff",
    "gitdiff"
  ],
  appendEOL: osTools.isWindows ? true : false,
  EOL: require('os').EOL,
  errorOnStaleApprovedFiles: true,
  shouldIgnoreStaleApprovedFile: function() { return false; },
  stripBOM: false
};

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

var getConfig = function() {
  var homeConfig = getHomeApprovalConfig() || {};
  var newConfig = _.defaults(homeConfig, defaultConfig);
  return newConfig;
};

module.exports = {
  getConfig: getConfig,
  getHomeApprovalConfig: getHomeApprovalConfig,
  defaultConfig: defaultConfig
};
