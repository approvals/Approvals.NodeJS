var _ = require("underscore");
var osTools = require("./osTools.js");

var defaultConfig = {
    reporters: ["opendiff", "p4merge", "tortoisemerge", "gitdiff"],
    appendEOL: osTools.isWindows ? true : false,
    EOL: require('os').EOL
};

// if someone tries to call 'require("approvals").configure()...' without calling ".mocha(...) or .jasmine(...) they won't get a helpful error. So we put this in there - just in case"
if(typeof beforeEach === "function"){
    beforeEach(function(){
        this.verify = function(){
            throw "You must call either .mocha(__dirname) or .jasmine(__dirname)";
        };
    });
}

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
