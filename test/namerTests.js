var assert = require("assert");
var Namer = require("../lib/Namer.js");


describe('StringWriter', function () {

	describe('getReceivedFile & approvedFile', function () {
		it('should format a path that has no trailing separator', function () {
			var pathWithoutTrailingSlash = "C:\\temp";
			var fileName = "foo.js";
			var namer = new Namer(pathWithoutTrailingSlash, fileName);

			assert.equal(namer.getReceivedFile("txt"), "C:\\temp\\foo.js.received.txt");

			assert.equal(namer.getApprovedFile("png"), "C:\\temp\\foo.js.approved.png");
		})
	})
})