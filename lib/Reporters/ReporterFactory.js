exports.loadReporter = function (name) {
	var reporter;
	try {
		reporter = require("./" + name + "Reporter.js");
	}
	catch (e) {

		var allFiles = require('fs').readdirSync(__dirname);
		var availableReporters = "";

		allFiles.forEach(function (item) {
			if (item.indexOf("Reporter.js") > 0) {
				if (availableReporters) {
					availableReporters += ", ";
				}
				availableReporters += item.replace("Reporter.js", '');
			}
		});

		throw "Reporter not found [name]. Try one of the following [" + availableReporters + "]";
	}
	return new reporter();
};