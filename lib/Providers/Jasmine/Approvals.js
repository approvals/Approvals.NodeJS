var Namer = require("./JasmineNamer.js");
var baseVerifier = require("../BeforeEachVerifierBase.js");

module.exports = function (options, dirName) {
    return baseVerifier(Namer, "require('Approvals').jasmine(__dirname);", options, dirName);
};
