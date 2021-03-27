'use strict';

var fs = require('fs');
var chalk = require('chalk');

function normalizeLineEndings(value) {
  return value.replace(/(?:\r\n|\r|\n)/g, '\n');
}


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
  var failOnLineEndingDifferences = (options && options.failOnLineEndingDifferences);

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
      reporter.report(approvedFileName, receivedFileName, options);
    } catch (ex) {
      reporterError = "\nError raised by reporter [" + reporter.name + "]: " + ex + "\n";
    }

    throw new Error((reporterError ? (reporterError + "\n") : "") + msg + ": \nApproved: " + approvedFileName + "\nReceived: " + receivedFileName + '\n');
  };

  if (!fs.existsSync(approvedFileName)) {
    throwReporterError("Approved file does not exist: " + approvedFileName);
  }

  if (!stripBOM) {
    if (fs.statSync(approvedFileName).size !== fs.statSync(receivedFileName).size && failOnLineEndingDifferences) {
      throwReporterError("File sizes do not match");
    }
  }

  var approvedFileBuffer = fs.readFileSync(approvedFileName, 'utf8') || "";
  var receivedFileBuffer = fs.readFileSync(receivedFileName, 'utf8') || "";

  // Remove a Byte Order Mark if configured
  if (stripBOM) {
    approvedFileBuffer = approvedFileBuffer.replace(/^\uFEFF/, '');
    receivedFileBuffer = receivedFileBuffer.replace(/^\uFEFF/, '');
  }

  var approvedFileBufferNormalized = approvedFileBuffer;
  var receivedFileBufferNormalized = receivedFileBuffer;

  if (approvedFileBuffer.length === 0 && receivedFileBuffer.length > 0) {
    throwReporterError("Approved file is blank.");
  }

  if (approvedFileBuffer.length !== receivedFileBuffer.length) {
    throwReporterError("Files do not match.");
  }

  for (var i = 0, bufferLength = approvedFileBuffer.length; i < bufferLength; i++) {
    if (approvedFileBuffer[i] !== receivedFileBuffer[i]) {

      // attempt to compare with normalized line endings
      approvedFileBufferNormalized = normalizeLineEndings(approvedFileBuffer.toString());
      receivedFileBufferNormalized = normalizeLineEndings(receivedFileBuffer.toString());

      if (failOnLineEndingDifferences) {
        throwReporterError("Files do not match");
      } else {
        if (approvedFileBufferNormalized === receivedFileBufferNormalized) {

          // debug...
          // console.log('************')
          // console.log('Approved:', JSON.stringify(approvedFileBuffer.toString()))
          // console.log('Received:', JSON.stringify(receivedFileBuffer.toString()))
          // console.log('**')
          // console.log('Approved:', JSON.stringify(approvedFileBufferNormalized))
          // console.log('Received:', JSON.stringify(receivedFileBufferNormalized))
          // console.log('**')
          // console.log('Approved:', approvedFileBufferNormalized)
          // console.log('Received:', receivedFileBufferNormalized)
          // console.log('************')

          console.warn("Files differ by line-endings: \nApproved: " + approvedFileName + "\nReceived: " + receivedFileName + '\nIf you want to fail this test when they differ, set the approvals config option { failOnLineEndingDifferences: true }');

          // have to break out of this or we'll log this statement
          // for all different bytes in the file arrays
          break;
        } else {
          throwReporterError("Files do not match");
        }
      }
    }
  }

  // delete the received file
  fs.unlinkSync(receivedFileName);

  process.emit("approvalFileApproved", approvedFileName);
};
