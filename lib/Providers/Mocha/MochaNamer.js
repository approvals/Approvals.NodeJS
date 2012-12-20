//var pathUtil = require('path');

var Namer = require('../../Namer');

var MochaNamer = function (mochaContext) {
	if (!mochaContext) {
		throw "Mocha context was not ";
	}
	this.ctx = mochaContext;
	//	var that = this;
	//	that.path = path;
	//	that.name = name[name.length - 1] == '.' ? name.substring(0, name.length - 1) : name;
};

MochaNamer.prototype = Namer.prototype;

MochaNamer.prototype.getFullTestName = function () {
	var test = this.ctx.test;

	var parentStack = [];
	var currParent = test;
	while (currParent && currParent.parent) {
		parentStack.push(currParent);
		currParent = currParent.parent;
	}

	var newTitle = '';
	var parentStackReversed = parentStack.reverse();
	parentStackReversed.forEach(function (item) {
		if (item !== parentStackReversed[0])
			newTitle += ".";

		newTitle += item.title.split(' ').join('_').replace(/[^\w\s]/gi, '_');
	});

	return newTitle;
};

//MochaNamer.prototype.pathCreator = function (type, ext) {
//	var cleanedExt = ext[0] == '.' ? ext.substring(1) : ext;
//	return pathUtil.join(this.path, (this.name + "." + type + "." + cleanedExt));
//};

//MochaNamer.prototype.getReceivedFile = function (ext) {
//	return this.pathCreator("received", ext);
//};

////Namer.prototype.getApprovedFile = function (ext) {
////	return this.pathCreator("approved", ext);
////};


module.exports = MochaNamer;