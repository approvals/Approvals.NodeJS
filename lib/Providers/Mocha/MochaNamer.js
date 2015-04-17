var Namer = require('../../Namer');

var getFullTestName = function (testContext) {
  var test = testContext;

  var parentStack = [];
  var currParent = test;
  while (currParent && currParent.parent) {
    parentStack.push(currParent);
    currParent = currParent.parent;
  }

  var newTitle = '';
  var parentStackReversed = parentStack.reverse();
  parentStackReversed.forEach(function (item) {
    if (item !== parentStackReversed[0]) {
      newTitle += ".";
    }

    newTitle += item.title.split(' ').join('_').replace(/[^\w\s]/gi, '_');
  });

  return newTitle;
};

var MochaNamer = function (mochaContext, path) {
  if (!mochaContext) {
    throw "Mocha context was not ";
  }
  this.ctx = mochaContext;
  this.path = path;
};

MochaNamer.getContext = function () {
  return { test: this.currentTest };
};

MochaNamer.prototype = new Namer();
MochaNamer.prototype.constructor = MochaNamer;
MochaNamer.prototype.getFullTestName = getFullTestName;
MochaNamer.prototype.pathCreator = function (type, ext) {
  if (!this.name) {
    if (!this.ctx) {
      throw "ctx was not defined.";
    }
    this.name = getFullTestName(this.ctx.test);
  }

  return Namer.prototype.pathCreator.call(this, type, ext);
};

module.exports = MochaNamer;
