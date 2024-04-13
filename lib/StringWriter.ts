'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var autils = require('./AUtils');

var lineEndingRegex = new RegExp("\r?\n", "g"); //eslint-disable-line no-control-regex
function normalizeLineEndings(lineEnding, value) {
  if (autils.isBinaryFile(value)) {
    return value;
  }
  return value.replace(lineEndingRegex, lineEnding);
}
class StringWriter {
  constructor(config, outputText, ext) {

    if (typeof outputText !== "string") {
      throw new Error("The outputText provided is not a 'string' value but is a typeof " + (typeof outputText));
    }

    this.config = config;
    this.ext = ext || "txt";
    this.outputText = outputText;
  }

  getFileExtension() {
    return this.ext;
  }

  write(filePath) {

    var dir = path.dirname(path.normalize(filePath));
    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir);
    }

    if (this.config.normalizeLineEndingsTo !== false && this.config.normalizeLineEndingsTo !== undefined) {
      this.outputText = normalizeLineEndings(this.config.normalizeLineEndingsTo, this.outputText);
    }

    if (this.config.appendEOL) {

      var CRLF = "\r\n";
      var LF = "\n";

      var endsWithCRLF = this.outputText && this.outputText.length >= 2 &&
        this.outputText[this.outputText.length - 2] === CRLF[0] &&
        this.outputText[this.outputText.length - 1] === CRLF[1];
      var endsWithLF = this.outputText && this.outputText.length >= 1 &&
        this.outputText[this.outputText.length - 1] === LF;

      if (!endsWithCRLF && !endsWithLF) {
        this.outputText += this.config.EOL;
      }

    }
    fs.writeFileSync(filePath, this.outputText);
  }
}

module.exports = StringWriter;
