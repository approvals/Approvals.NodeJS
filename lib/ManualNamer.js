'use strict';

var Namer = require('./Namer');

var ManualNamer = function (dirName, testFileName) {
  this.path = dirName;
  this.name = testFileName;
};

ManualNamer.prototype = new Namer();
ManualNamer.prototype.constructor = ManualNamer;
module.exports = ManualNamer;
