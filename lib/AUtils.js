var fs = require('fs');

module.exports = {
	createEmptyFileIfNotExists: function (file) {
		if (!fs.existsSync(file)) {
			fs.writeFileSync(file, "");
		}
	}
};