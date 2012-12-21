
exports.mocha = function (args) {
	return require("./Providers/Mocha/Approvals.Mocha.js")(args);
};

exports.verify = function () {
	throw 'awesome will happen...soon...';
};
