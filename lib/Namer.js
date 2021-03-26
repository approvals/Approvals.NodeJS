'use strict';

var pathUtil = require('path');

class Namer {

  constructor(path, name) {
    path = path || '';
    name = name || '';

    var that = this;
    that.path = path;
    that.name = name[name.length - 1] === '.' ? name.substring(0, name.length - 1) : name;
  }

  pathCreator(type, ext) {
    ext = ext || 'txt';
    var cleanedExt = ext[0] === '.' ? ext.substring(1) : ext;
    return pathUtil.join(this.path, (this.name + "." + type + "." + cleanedExt));
  }

  getReceivedFile(ext) {
    return this.pathCreator("received", ext);
  }

  getApprovedFile(ext) {
    return this.pathCreator("approved", ext);
  }

}

module.exports = Namer;
