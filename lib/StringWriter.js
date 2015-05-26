'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var StringWriter = function (config, outputText, ext) {
  this.config = config;
  this.ext = ext || "txt";
  this.outputText = outputText;
  this.eolRegex = new RegExp(config.EOL + "$");
};

StringWriter.prototype.getFileExtension = function () {
  return this.ext;
};

StringWriter.prototype.write = function (filePath) {

  var dir = path.dirname(path.normalize(filePath));
  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }

  if (this.config.appendEOL) {
    // only append the EOL suffix if it doesn't already exists
    if (!(this.eolRegex.test(this.outputText))) {
      console.log("ADDING EOL");
      this.outputText += this.config.EOL;
    }
  }
  fs.writeFileSync(filePath, this.outputText);
};

module.exports = StringWriter;
