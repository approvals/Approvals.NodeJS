var autils = require('../AUtils');
var fs = require('fs');

var GenericDiffReporterBase = function () {
};

GenericDiffReporterBase.prototype.canReportOn = function (fileName) {

	if (!fs.existsSync(fileName)) {
		throw "File not found: " + fileName;
	}

	return !autils.isBinaryFile(fileName);
};


module.exports = GenericDiffReporterBase;
