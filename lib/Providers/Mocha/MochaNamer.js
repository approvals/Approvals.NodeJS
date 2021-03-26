'use strict';

var path = require('path');
var Namer = require('../../Namer');

class MochaNamer extends Namer {
  constructor(mochaTest, overrideBasePath) {
    if (!mochaTest) {
      throw new Error("Mocha test context was not supplied");
    }

    super(null, null);

    this.ctx = mochaTest;
    this.path = overrideBasePath || path.dirname(mochaTest.test.file);

  }

  getFullTestName(testContext) {
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
  }

  pathCreator(type, ext) {
    if (!this.name) {
      if (!this.ctx) {
        throw new Error("ctx was not defined.");
      }
      this.name = this.getFullTestName(this.ctx.test);
    }

    return super.pathCreator(type, ext);
  }

}

module.exports = MochaNamer;
