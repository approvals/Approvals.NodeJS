'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var autils = require('./AUtils');

var StringWriter = function (config, outputText, ext) {

  if (typeof outputText !== "string") {
    throw new Error("The outputText provided is not a 'string' value but is a typeof " + (typeof outputText));
  }

  this.config = config;
  this.ext = ext || "txt";
  this.outputText = outputText;
  this.eolRegex = new RegExp(config.EOL + "$");

};

var lineEndingRegex = new RegExp("\r?\n", "g");
function normalizeLineEndings(lineEnding, value) {
  if (autils.isBinaryFile(value)) {
    return value;
  }
  return value.replace(lineEndingRegex, lineEnding);
}

StringWriter.prototype.getFileExtension = function () {
  return this.ext;
};

StringWriter.prototype.write = function (filePath) {

  var dir = path.dirname(path.normalize(filePath));
  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }

  if (this.config.normalizeLineEndingsTo !== false && this.config.normalizeLineEndingsTo !== undefined) {
    this.outputText = normalizeLineEndings(this.config.normalizeLineEndingsTo, this.outputText);
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
