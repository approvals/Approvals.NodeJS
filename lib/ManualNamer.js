'use strict';

var Namer = require('./Namer');

class ManualNamer extends Namer {
  constructor (dirName, testFileName) {
    super(dirName, testFileName);
    this.path = dirName;
    this.name = testFileName;
  }
}

module.exports = ManualNamer;
