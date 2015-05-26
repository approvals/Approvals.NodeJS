'use strict';

var assert = require('assert');
var fs = require('fs');
var expect = require('chai').expect;

var Namer = require("../lib/Namer.js");
var StringWriter = require("../lib/StringWriter.js");
var FileApprover = require("../lib/FileApprover.js");

var ShouldFailCustomReporter = function () {
  return {
    canReportOn: function (/*file*/) {
      return true;
    },
    report: function (/*approved, received*/) {
      throw "This reporter should never run";
    },
    name: "ShouldFailCustomReporter"
  };
};

describe('FileApprover', function () {

  describe("when two files match", function(){

    var namer;
    var reporterFactory;
    var writer;
    var config = { appendEOL: false };

    beforeEach(function(){
      var dir = __dirname;
      var fileName = "FileApprover.should_verify_two_files_match";
      namer = new Namer(dir, fileName);
      writer = new StringWriter(config, "HELLO!");
      reporterFactory = function() {
        return new ShouldFailCustomReporter();
      };
    });

    describe('when validating arguments', function(){

      it("should validate namer (parameter 1)", function(){
        expect(function(){
          FileApprover.verify(null);
        }).to.throw(Error, 'namer')
      });

      it("should validate writer (parameter 2)", function(){
        expect(function(){
          FileApprover.verify(namer, null);
        }).to.throw(Error, 'writer')
      });

      it("should validate reporterFactory (parameter 3)", function(){
        expect(function(){
          FileApprover.verify(namer, writer, null);
        }).to.throw(Error, 'reporterFactory')
      });

    });

    it('should verify two files match', function () {
      FileApprover.verify(namer, writer, reporterFactory);
    });

    it('should remove the received file', function () {
      FileApprover.verify(namer, writer, reporterFactory);
      var receivedFileName = namer.getReceivedFile(writer.getFileExtension());

      assert.ok(!fs.existsSync(receivedFileName), "Received File should be deleted");
    });

    it('should raise an event with the approved file name', function (done) {
      var approvedFileName = namer.getApprovedFile(writer.getFileExtension());

      process.once("approvalFileApproved", function(fileName){
        assert.equal(fileName, approvedFileName);

        done();
      });

      FileApprover.verify(namer, writer, reporterFactory);
    });

    it('should fail the approver if the writer gives something different', function () {

      writer = new StringWriter(config, "BYE");

      assert.throws(function() {
        FileApprover.verify(namer, writer, reporterFactory);
      });
    });

  });

});
