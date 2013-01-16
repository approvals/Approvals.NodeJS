var fs = require('fs');

var StringWriter = function (config, outputText, ext) {
	var that = this;
  that.config = config;
	that.ext = ext || "txt";
	that.outputText = outputText;
};

StringWriter.prototype.getFileExtension = function () {
	return this.ext;
};

StringWriter.prototype.write = function (filePath) {

	// Not sure this is a good idea, but appending an EOL to the string data seems to make other diff tools happier
	if(this.config.appendEOL) {
    fs.writeFileSync(filePath, this.outputText + require('os').EOL);
  } else {
	  fs.writeFileSync(filePath, this.outputText);
  }
};

module.exports = StringWriter;
