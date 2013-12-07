var Namer = require('../../Namer');

var getParentName = function(item){
    var name = '';
    if(item && item.parentSuite){
        name = getParentName(item.parentSuite);
    }
    return name + "." + item.description;
};

var getFullTestName = function (testContext) {
    var test = testContext;

    var name = getParentName(test);
    name = name.split(' ').join('_').replace(/[^\w\s]/gi, '_');
    console.log(name);
    return name;
};


var JasmineNamer = function (mochaContext, path) {
    if (!mochaContext) {
        throw "Jasmine context was not available.";
    }
    this.ctx = mochaContext;
    this.path = path;
};

JasmineNamer.prototype = new Namer();
JasmineNamer.prototype.constructor = Namer;

JasmineNamer.prototype.pathCreator = function (type, ext) {
    console.log(this.name);
    console.log("**");
    if (!this.name) {
        if (!this.ctx) {
            throw "ctx was not defined.";
        }
        this.name = getFullTestName(this.ctx.suite);
    }

    return Namer.prototype.pathCreator.call(this, type, ext);
};

module.exports = JasmineNamer;
