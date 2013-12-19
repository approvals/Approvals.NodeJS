var assert = require("assert");
var path = require('path');
var MochaNamer = require("../../../lib/Providers/Mocha/MochaNamer.js");


describe('MochaNamer', function () {

    describe('when given a mocha context', function () {
        it('should generate correct name', function () {

            var root = "C:\\temp\\";
            var fileName = path.join("C:\\temp\\", "foo.js");

            var namer = new MochaNamer(this, root, fileName);

            var approvedFileName = namer.getApprovedFile();
            var receivedFileName = namer.getReceivedFile();

            assert.equal(approvedFileName,
                path.join("C:\\temp\\",
                    "MochaNamer.when_given_a_mocha_context.should_generate_correct_name.approved.txt"));
            assert.equal(receivedFileName,
                path.join("C:\\temp\\",
                    "MochaNamer.when_given_a_mocha_context.should_generate_correct_name.received.txt"));
        });
    });
});
