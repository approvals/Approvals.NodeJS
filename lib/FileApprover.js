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
    const allReporters = reporterFactory();

    var reporter = allReporters.filter(function (reporterCandidate) {
      return reporterCandidate.canReportOn(receivedFileName);
    })[0];

    if (!reporter) {
      throw new Error("\nNo compatible reporter found in configured list [" + allReporters.map(r => r.name).join(',') + "] for: " + receivedFileName);
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

  var approvedFileContents = fs.readFileSync(approvedFileName, 'utf8') || "";
  var receivedFileContents = fs.readFileSync(receivedFileName, 'utf8') || "";

  // Remove a Byte Order Mark if configured
  if (stripBOM) {
    approvedFileContents = approvedFileContents.replace(/^\uFEFF/, '');
    receivedFileContents = receivedFileContents.replace(/^\uFEFF/, '');
  }

  var approvedFileBufferNormalized = approvedFileContents;
  var receivedFileBufferNormalized = receivedFileContents;

  if (approvedFileContents.length === 0 && receivedFileContents.length > 0) {
    throwReporterError("Approved file is blank.");
  }

  let testBufferLength = true;

  if (failOnLineEndingDifferences) {

    if (approvedFileContents !== receivedFileContents) {

      throwReporterError("Files do not match");

    }

  } else {

    if (approvedFileContents !== receivedFileContents) {

      // attempt to compare with normalized line endings
      approvedFileBufferNormalized = normalizeLineEndings(approvedFileContents);
      receivedFileBufferNormalized = normalizeLineEndings(receivedFileContents);

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

        testBufferLength = false;

      } else {
        throwReporterError("Files do not match.");
      }

    }

  }

  if (testBufferLength && (approvedFileContents.length !== receivedFileContents.length)) {
    throwReporterError("Files do not match.");
  }

  // delete the received file
  fs.unlinkSync(receivedFileName);

  process.emit("approvalFileApproved", approvedFileName);

};
