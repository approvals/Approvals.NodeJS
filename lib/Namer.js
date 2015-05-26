'use strict';

var pathUtil = require('path');

var Namer = function (path, name) {
  path = path || '';
  name = name || '';

  var that = this;
  that.path = path;
  that.name = name[name.length - 1] === '.' ? name.substring(0, name.length - 1) : name;
};

Namer.prototype.pathCreator = function (type, ext) {
  ext = ext || 'txt';
  var cleanedExt = ext[0] === '.' ? ext.substring(1) : ext;
  return pathUtil.join(this.path, (this.name + "." + type + "." + cleanedExt));
};

Namer.prototype.getReceivedFile = function (ext) {
  return this.pathCreator("received", ext);
};

Namer.prototype.getApprovedFile = function (ext) {
  return this.pathCreator("approved", ext);
};

module.exports = Namer;
