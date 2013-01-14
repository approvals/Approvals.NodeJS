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

	// Not sure this is a good idea, but appending an EOL to the string data seems to make other diff tools happier
	fs.writeFileSync(filePath, this.outputText + require('os').EOL);
};

module.exports = StringWriter;
