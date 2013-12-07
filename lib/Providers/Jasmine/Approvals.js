/*global beforeEach */
var _ = require('underscore');
var libRoot = "../../../lib";
var Namer = require("./JasmineNamer.js");
var StringWriter = require(libRoot + "/StringWriter.js");
var FileApprover = require(libRoot + "/FileApprover.js");
var ReporterFactory = require(libRoot + "/Reporters/ReporterFactory.js");
var fs = require('fs');


module.exports = function (options, dirName) {
    if (!dirName) {
        throw "'dirName' parameter not found. Try using the following syntax. > require('Approvals').jasmine(__dirname);";
    }

    // Make sure it's a valid directory
    var stats = fs.lstatSync(dirName);
    if (!stats.isDirectory()) {
        throw "Invalid directory [" + dirName + "]. Try using the following syntax. > require('Approvals').jasmine(__dirname);";
    }


    beforeEach(function () {
        if(this === undefined) throw "this is undefined in the jasmine beforeEach";
        var namer = new Namer(this, dirName);
        var reporter = ReporterFactory.loadReporter(options.reporters);

        this.verify = function (data, optionalReporterOverride) {

            if (_.isArray(optionalReporterOverride) || (typeof optionalReporterOverride === "string")) {
                reporter = ReporterFactory.loadReporter(optionalReporterOverride);
            }

            var writer = new StringWriter(options, data);
            FileApprover.verify(namer, writer, reporter);
        };
    });
};
