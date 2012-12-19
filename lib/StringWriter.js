var fs = require('fs');

var StringWriter = function (outputText, ext) {
	var that = this;
	that.ext = ext || "txt";
	that.outputText = outputText;
};

StringWriter.prototype.getFileExtension = function () {
	return this.ext;
};

StringWriter.prototype.write = function (filePath) {
	fs.writeFileSync(filePath, this.outputText);
};

module.exports = StringWriter;