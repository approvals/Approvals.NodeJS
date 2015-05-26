'use strict';

var fs = require('fs');
var autils = require('./AUtils');

var FileApprover = function () { };
FileApprover.verify = function (namer, writer, reporterFactory, options) {

  if (!namer) {
    throw new Error("missing argument 'namer'");
  }
  if (!writer) {
    throw new Error("missing argument 'writer'");
  }
  if (!reporterFactory) {
    throw new Error("missing argument 'reporterFactory'");
  }

  var approvedFileName = namer.getApprovedFile(writer.getFileExtension());
  var receivedFileName = namer.getReceivedFile(writer.getFileExtension());

  writer.write(receivedFileName);

  if (autils.hasCommandLineArgument("--forceapproveall") ||
      autils.hasCommandLineArgument("-f")) {
    writer.write(approvedFileName);
  }

  var throwReporterError = function (msg) {
    var reporter = reporterFactory();
    var reporterError;
    try {
      reporter.report(approvedFileName, receivedFileName);
    } catch (ex) {
      reporterError = "\nError raised by reporter [" + reporter.name + "]: " + ex + "\n";
    }

    throw (reporterError ? (reporterError + "\n") : "") + msg + ": \nApproved: " + approvedFileName + "\nReceived: " + receivedFileName + '\n';
  };

  if (!fs.existsSync(approvedFileName)) {
    throwReporterError("Approved file does not exist: " + approvedFileName);
  }

  if (fs.statSync(approvedFileName).size !== fs.statSync(receivedFileName).size) {
    throwReporterError("File sizes do not match");
  }

  var approvedFileBuffer = fs.readFileSync(approvedFileName, 'utf8') || "";
  var receivedFileBuffer = fs.readFileSync(receivedFileName, 'utf8') || "";

  // Remove a Byte Order Mark if configured
  if (options && options.stripBOM) {
    approvedFileBuffer = approvedFileBuffer.replace(/^\uFEFF/, '');
    receivedFileBuffer = receivedFileBuffer.replace(/^\uFEFF/, '');
  }

  for (var i = 0, bufferLength = approvedFileBuffer.length; i < bufferLength; i++) {
    if (approvedFileBuffer[i] !== receivedFileBuffer[i]) {
      throwReporterError("Files do not match");
    }
  }

  // delete the received file
  fs.unlinkSync(receivedFileName);

  process.emit("approvalFileApproved", approvedFileName);
};

module.exports = FileApprover;
