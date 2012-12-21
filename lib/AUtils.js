var fs = require('fs');

module.exports = {
	createEmptyFileIfNotExists: function (file) {
		if (!fs.existsSync(file)) {
			fs.writeFileSync(file, "");
		}
	},

	// copied and modified from http://stackoverflow.com/questions/10225399/check-if-a-file-is-binary-or-ascii-with-node-js
	isBinaryFile: function (buffer) {
		var charCode, contentStartBinary, contentStartUTF8, i, _i, _ref;
		contentStartBinary = buffer.toString('binary', 0, 24);
		contentStartUTF8 = buffer.toString('utf8', 0, 24);

		for (i = _i = 0, _ref = contentStartUTF8.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
			charCode = contentStartUTF8.charCodeAt(i);
			if (charCode === 65533 || charCode <= 8) {
				return true;
			}
		}
		return false;
	}
};