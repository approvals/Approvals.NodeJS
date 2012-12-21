var ReporterFactory = require("../../lib/Reporters/ReporterFactory.js");
var assert = require("assert");

describe('ReporterFactory', function () {

	var textDiffReporters = ['gitdiff', 'p4merge'];
	var allAvailableDiffReporters = ['gitdiff', 'p4merge'];

	it('Should load specific reporters', function () {
		allAvailableDiffReporters.forEach(function (differ) {
			ReporterFactory.loadReporter(differ);
		});
	});

	it('Should report all available if incorrect name specified', function () {
		try {
			ReporterFactory.loadReporter('wat?');
		}
		catch (e) {
			if (e.indexOf("Reporter not found [wat?]. Try one of the following") === -1) {
				throw e;
			}
		}
	});

	it('Should load all reporters', function () {
		var reporters = ReporterFactory.loadAllReporters(allAvailableDiffReporters);
		assert.equal(reporters.length, allAvailableDiffReporters.length);
	});

	it("should be able to report on a txt file", function () {

		var reporters = ReporterFactory.loadAllReporters(textDiffReporters);

		reporters.forEach(function (reporter) {

			assert.ok(reporter.canReportOn, "Reporter missing 'canReportOn' function for reporter [" + reporter.name + "]");

			var canReportOn = reporter.canReportOn(__dirname + "\\a.txt");
			assert.ok(canReportOn, "Could not load reporter with name [" + reporter.name + "]");
		});

	});

	describe("When loading an array of reporters", function () {
		it("should use the ReporterDiffAggregate", function () {
			ReporterFactory.loadReporter(textDiffReporters);
		});
	});
});
