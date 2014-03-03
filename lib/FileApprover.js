var fs = require('fs');

var FileApprover = function () { };
FileApprover.verify = function (namer, writer, reporter) {

    if (!namer) throw "missing argument 'namer'";
    if (!writer) throw "missing argument 'writer'";
    if (!reporter) throw "missing argument 'reporter'";

    var approvedFileName = namer.getApprovedFile(writer.getFileExtension());
    var receivedFileName = namer.getReceivedFile(writer.getFileExtension());

    writer.write(receivedFileName);

    var throwReporterError = function (msg) {
        var reporterError;
        try {
            reporter.report(approvedFileName, receivedFileName);
        } catch (ex) {
            //reporterError = "\nError raised by reporter [" + require('util').inspect(reporter) + "]: " + ex + "\n";
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

    var approvedFileBuffer = fs.readFileSync(approvedFileName);
    var receivedFileBuffer = fs.readFileSync(receivedFileName);

    for (var i = 0, bufferLength = approvedFileBuffer.length; i < bufferLength; i++) {
        if (approvedFileBuffer[i] !== receivedFileBuffer[i]) {
            throwReporterError("Files do not match");
        }
    }

    fs.unlinkSync(receivedFileName);

    process.emit("approvalFileApproved", approvedFileName);
};


module.exports = FileApprover;
