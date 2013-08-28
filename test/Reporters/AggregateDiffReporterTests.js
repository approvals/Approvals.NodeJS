var ReporterFactory = require("../../lib/Reporters/ReporterFactory.js");
var assert = require("assert");
var path = require("path");
var DiffReporterAggregate = require("../../lib/Reporters/DiffReporterAggregate.js");

describe('AggregateReporter', function () {

    var textDiffReporters = ['gitdiff', 'p4merge'];

    it("should be able to report on a txt file", function () {

        var file = path.join(__dirname, "a.txt");

        var reporters = ReporterFactory.loadAllReporters(textDiffReporters);

        var reporterX = new DiffReporterAggregate(reporters);
        var canReportOn = reporterX.canReportOn(file);
        assert.ok(canReportOn, "Can report on " + file);

        var foundReporter = reporterX.getReporter(file);

        assert.ok(foundReporter, "foundReporter not found?");
    });
});
