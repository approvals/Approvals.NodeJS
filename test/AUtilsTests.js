var utils = require("../lib/AUtils.js");
var assert = require("assert");


describe('AUtils', function () {
	describe('findProgramOnPath', function () {
		describe("when using windows where.exe to find programs", function () {
			it('ipconfig should be found once', function () {

				var ipconfigFIlePath = utils.findProgramOnPath("ipconfig");

				utils.assertFileExists(ipconfigFIlePath);
			});

			it('notepad is found multiple times and we should just use the first one', function () {

				var ipconfigFIlePath = utils.findProgramOnPath("ipconfig");

				utils.assertFileExists(ipconfigFIlePath);
			});
		});
	});

	describe('findWindowsExecutable', function () {
		describe("when using windows where.exe to find programs", function () {
			it('ipconfig should be found once', function () {

				var file = utils.findWindowsExecutable("ipconfig");

				utils.assertFileExists(file);
			});

			it('notepad is found multiple times and we should just use the first one', function () {

				var file = utils.findWindowsExecutable("ipconfig");

				utils.assertFileExists(file);
			});
		});

		describe("When lookign for a program in program files", function () {
			it("should find iexplorer", function () {

				var file = utils.findWindowsExecutable("Internet Explorer", "iexplore");

				utils.assertFileExists(file);
			});
		});
	});

	describe('fixFilePathSlashes', function () {
		it("should replace back slashes with forward slashes", function () {

			var before = "C:\\Windows\\System32\\ipconfig.exe";
			var expected = "C:/Windows/System32/ipconfig.exe";

			var fixed = utils.fixFilePathSlashes(before);

			assert.equal(fixed, expected);
		});
	});
});