var _ = require("underscore");
var osTools = require("./osTools.js");

var defaultConfig = {
    reporters: ["opendiff", "p4merge", "tortisemerge", "gitdiff"],
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
    var Namer = require("./Providers/Mocha/MochaNamer.js");
    var baseVerifier = require("./Providers/BeforeEachVerifierBase.js");

    baseVerifier(Namer, "require('Approvals').mocha(__dirname);", exports.options, dir);

    return exports;
};

exports.jasmine = function (dir) {
    var Namer = require("./Providers/Jasmine/JasmineNamer.js");
    var baseVerifier = require("./Providers/BeforeEachVerifierBase.js");

    baseVerifier(Namer, "require('Approvals').jasmine(__dirname);", exports.options, dir);

    return exports;
};

exports.verify = function () {
    throw 'awesome will happen...soon...';
};
