'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var fileType = require('file-type');

var BinaryWriter = function (config, outputData) {
  this.config = config;
  this.outputData = outputData;
};

BinaryWriter.prototype.getFileExtension = function () {
  if (!this._ext) {
    var fileTypeDiscovered = fileType(this.outputData);
    this._ext = fileTypeDiscovered.ext;
  }
  return this._ext || 'blob'; // not sure what to call an un-known binary file
};

BinaryWriter.prototype.write = function (filePath) {

  var dir = path.dirname(path.normalize(filePath));
  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }

  fs.writeFileSync(filePath, this.outputData);
};

module.exports = BinaryWriter;
