var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

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

    var dir = path.dirname(path.normalize(filePath));
    if (!fs.existsSync(dir)) {
        mkdirp.sync(dir);
    }

    // Not sure this is a good idea, but appending an EOL to the string data seems to make other diff tools happier
    if (this.config.appendEOL) {
        var suffix = this.ext;
        if (this.outputText.indexOf(suffix, this.outputText.length - suffix.length) !== -1) {
            this.outputText += this.config.EOL;
        }
        fs.writeFileSync(filePath, this.outputText + this.config.EOL);
    } else {
        fs.writeFileSync(filePath, this.outputText);
    }
};

module.exports = StringWriter;
