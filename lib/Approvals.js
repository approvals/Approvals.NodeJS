var _ = require("underscore");

var DefaultReporter = require('./Reporters/GitDiffReporter');
//var DefaultReporter = require('./Reporters/P4MergeReporter');


var defaultConfig = {
	reporter: new DefaultReporter()
};

exports.options = _.defaults({}, defaultConfig);

exports.configure = function (options) {
	var newConfig = _.defaults(options, defaultConfig);
	exports.options = newConfig;
	throw 'TODO: test';
};

exports.mocha = function (args) {
	return require("./Providers/Mocha/Approvals.Mocha.js")(exports.options, args);
};

exports.verify = function () {
	throw 'awesome will happen...soon...';
};
