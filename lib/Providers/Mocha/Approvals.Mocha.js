var MochaNamer = require("./MochaNamer.js");
var baseVerifier = require("../BeforeEachVerifierBase.js");

module.exports = function (options, dirName) {
    return baseVerifier(MochaNamer, "require('Approvals').mocha(__dirname);", options, dirName);
};
