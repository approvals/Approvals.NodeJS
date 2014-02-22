/*global beforeEach */
var _ = require('underscore');
var libRoot = "../../lib";
var StringWriter = require(libRoot + "/StringWriter.js");
var FileApprover = require(libRoot + "/FileApprover.js");
var ReporterFactory = require(libRoot + "/Reporters/ReporterFactory.js");
var fs = require('fs');

module.exports = function (Namer, usageSample, options, dirName) {

    if (!dirName) {
        throw "'dirName' parameter not found. Try using the following syntax. > " + usageSample;
    }

    // Make sure it's a valid directory
    var stats = fs.lstatSync(dirName);
    if (!stats.isDirectory()) {
        throw "Invalid directory [" + dirName + "]. Try using the following syntax. > " + usageSample;
    }

    beforeEach(function () {
        var namer = new Namer(this, dirName);

        var approvalsExtras = {
            namer: namer,
            getCurrentReporter: function(optionalReporterOverride) {

                var reporter = ReporterFactory.loadReporter(options.reporters);

                if (_.isArray(optionalReporterOverride) || (typeof optionalReporterOverride === "string")) {
                    reporter = ReporterFactory.loadReporter(optionalReporterOverride);
                }

                if(optionalReporterOverride && optionalReporterOverride.canReportOn && optionalReporterOverride.report){
                    reporter = optionalReporterOverride;
                }

                return reporter;
            }
        };

        // Tack on an approvals property so we can tack on some 
        // helper approvals goo this is mostly used for the test.
        this.approvals = approvalsExtras;

        this.verify = function (data, optionalReporterOverride) {

            var reporter = approvalsExtras.getCurrentReporter(optionalReporterOverride);

            var writer = new StringWriter(options, data);
            FileApprover.verify(namer, writer, reporter);
        };

        this.verifyAsJSON = function (data, optionalReporterOverride) {
            this.verify(JSON.stringify(data, null, '  '), optionalReporterOverride);
        };

    });
};
