'use strict';
var Namer = require("../lib/Namer.js");
var StringWriter = require("../lib/StringWriter.js");
var DoNothingReporter = require("../lib/Reporters/donothingReporter.js");
var FileApprover = require("../lib/FileApprover.js");


describe('FileApprover', function () {

    describe('', function () {
        it('should verify two files match', function () {

            var dir = __dirname;
            var fileName = "FileApprover.should_verify_two_files_match";
            var namer = new Namer(dir, fileName);
            var config = { appendEOL: false };
            var writer = new StringWriter(config, "HELLO!");
            var reporter = new DoNothingReporter();

            FileApprover.verify(namer, writer, reporter);

        });
    });
});
