'use strict';

var fs = require('fs');
var chalk = require('chalk');

exports.verify = function (namer, writer, reporterFactory, options) {

  if (!namer) {
    throw new Error("missing argument 'namer'");
  }
  if (!writer) {
    throw new Error("missing argument 'writer'");
  }
  if (!reporterFactory) {
    throw new Error("missing argument 'reporterFactory'");
  }

  var stripBOM = (options && options.stripBOM);
  var forceApproveAll = (options && options.forceApproveAll);

  var approvedFileName = namer.getApprovedFile(writer.getFileExtension());
  var receivedFileName = namer.getReceivedFile(writer.getFileExtension());

  writer.write(receivedFileName);

  if (forceApproveAll) {
    console.log(chalk.yellow("WARNING: force approving: " + approvedFileName));
    writer.write(approvedFileName);
  }

  var selectFirstCompatibleReporter = function () {
    var reporter = reporterFactory().filter(function (reporterCandidate) {
      return reporterCandidate.canReportOn(receivedFileName);
    })[0];
    if (!reporter) {
      throw new Error("\nNo compatible reporter found for: " + receivedFileName);
    }
    return reporter;
  };

  var throwReporterError = function (msg) {
    var reporter = selectFirstCompatibleReporter();

    var reporterError;
    try {
      reporter.report(approvedFileName, receivedFileName);
    } catch (ex) {
      reporterError = "\nError raised by reporter [" + reporter.name + "]: " + ex + "\n";
    }

    throw new Error((reporterError ? (reporterError + "\n") : "") + msg + ": \nApproved: " + approvedFileName + "\nReceived: " + receivedFileName + '\n');
  };

  if (!fs.existsSync(approvedFileName)) {
    throwReporterError("Approved file does not exist: " + approvedFileName);
  }
  
  function readFileAndNormalize (filename) {
    var fileContent = fs.readFileSync(filename, 'utf8') || ""

    // Remove a Byte Order Mark if configured
    if (stripBOM) {
      fileContent = fileContent.replace(/^\uFEFF/, '');
    }
    var fileContentWithoutWindowsCR = fileContent.replace(/\r/g, "")
    return fileContentWithoutWindowsCR
  }

  var approvedFileBuffer = readFileAndNormalize(approvedFileName);
  var receivedFileBuffer = readFileAndNormalize(receivedFileName);


  for (var i = 0, bufferLength = approvedFileBuffer.length; i < bufferLength; i++) {
    if (approvedFileBuffer[i] !== receivedFileBuffer[i]) {
      throwReporterError("Files do not match");
    }
  }

  // delete the received file
  fs.unlinkSync(receivedFileName);

  process.emit("approvalFileApproved", approvedFileName);
};
