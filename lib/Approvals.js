var _ = require("underscore");
var osTools = require("./osTools.js");

var defaultConfig = {
	reporters: ["P4Merge", "gitdiff"],
  appendEOL: osTools.isWindows ? true : false
};

exports.options = _.defaults({}, defaultConfig);

exports.configure = function (options) {
	var newConfig = _.defaults(options, defaultConfig);
	exports.options = newConfig;
	return exports;
};

exports.mocha = function (dir) {
	return require("./Providers/Mocha/Approvals.Mocha.js")(exports.options, dir);
};

exports.verify = function () {
	throw 'awesome will happen...soon...';
};
