var ReporterFactory = require("../../lib/Reporters/ReporterFactory.js");

describe('ReporterFactory', function () {

	var availableReporters = ['gitdiff', 'p4merge'];

	it('Should load specific reporters', function () {
		availableReporters.forEach(function (differ) {
			ReporterFactory.loadReporter(differ);
		});
	});

	it('Should report all available if incorrect name specified', function () {
		try {
			ReporterFactory.loadReporter('wat?');
		}
		catch (e) {
			if (e.indexOf("Reporter not found [name]. Try one of the following") === -1) {
				throw e;
			}
		}
	});

});
