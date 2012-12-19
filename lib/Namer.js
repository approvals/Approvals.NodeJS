var pathUtil = require('path');

var Namer = function (path, name) {
	var that = this;
	that.path = path;
	that.name = name[name.length - 1] == '.' ? name.substring(0, name.length - 1) : name;

	var pathCreator = function (type, ext) {
		var cleanedExt = ext[0] == '.' ? ext.substring(1) : ext;

		return pathUtil.join(that.path, (that.name + "." + type + "." + cleanedExt))
	}

	that.getReceivedFile = function (ext) {
		return pathCreator("received", ext);
	};

	that.getApprovedFile = function (ext) {
		return pathCreator("approved", ext);
	}
}


module.exports = Namer;