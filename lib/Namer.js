var pathUtil = require('path');

var Namer = function (path, name) {
	var that = this;
	that.path = path;
	that.name = name;

	var pathCreator = function(type, ext){
		return pathUtil.join(that.path, (that.name + "." + type + "." + ext))
	}

	that.getReceivedFile = function (ext) {
		return pathCreator("received", ext);
	};

	that.getApprovedFile = function(ext){
		return pathCreator("approved", ext);
	}
}


module.exports = Namer;