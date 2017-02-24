'use strict';

var Namer = require('../../Namer');

var getParentName = function (item) {
  var name = '';
  if (item && item.parentSuite) {
    name = getParentName(item.parentSuite);
  }

  if (name) {
    return name + "." + item.description;
  } else {
    return item.description;
  }
};

var getFullTestName = function (testContext) {
  var test = testContext;

  // Go get all the 'describe(...)' parent nodes
  var name = getParentName(test);

  // Tack on the test's 'it(...)' description
  name = name + '.' + test.env.currentSpec.description;

  // Cleanup some strange characters replacing with underscore
  name = (name.trim()).split(' ').join('_').replace(/[^\w\s]/gi, '_');

  return name;
};

var JasmineNamer = function (context, path) {
  if (!context) {
    throw new Error("Jasmine context was not available.");
  }
  this.ctx = context;
  this.path = path;
};

JasmineNamer.getContext = function () {
  return this;
};

JasmineNamer.prototype = new Namer();
JasmineNamer.prototype.constructor = Namer;

JasmineNamer.prototype.pathCreator = function (type, ext) {
  if (!this.name) {
    if (!this.ctx) {
      throw new Error("ctx was not defined.");
    }
    this.name = getFullTestName(this.ctx.suite);
  }

  return Namer.prototype.pathCreator.call(this, type, ext);
};

module.exports = JasmineNamer;
