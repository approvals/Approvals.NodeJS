var _ = require("underscore");
var osTools = require("./osTools.js");

var defaultConfig = {
    reporters: ["p4merge", "opendiff", "tortisemerge", "gitdiff"],
    appendEOL: osTools.isWindows ? true : false,
    EOL: require('os').EOL
};

exports.options = _.defaults({}, defaultConfig);

exports.configure = function (options) {
    var newConfig = _.defaults(options, defaultConfig);
    exports.options = newConfig;
    return exports;
};

exports.mocha = function (dir) {
    require("./Providers/Mocha/Approvals.Mocha.js")(exports.options, dir);
    return exports;
};

exports.verify = function () {
    throw 'awesome will happen...soon...';
};
