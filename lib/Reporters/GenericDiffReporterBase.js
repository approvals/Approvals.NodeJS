var autils = require('../AUtils');
var fs = require('fs');

var GenericDiffReporterBase = function () {
};

GenericDiffReporterBase.prototype.canReportOn = function (fileName) {

	autils.assertFileExists(fileName);

	if (!fs.existsSync(this.exePath))
		return false;

	var isBinary = autils.isBinaryFile(fileName);
	if (isBinary) {
		return false;
	}

	return true;
};


module.exports = GenericDiffReporterBase;
