'use strict';

var childProcess = require('child_process');
var autils = require('../AUtils');
var fs = require('fs');
var reportingLaunchingCircuitBreaker = require('./ReportLaunchingCircuitBreaker');

class GenericDiffReporterBase {

  constructor(name) {

    if (!name) {
      throw new Error("Argument name missing");
    }

    this.name = name;

    this._reporterFileLookedUp = false;
    this._reporterFileLookedUpAndFound = false;
  }

  isReporterAvailable() {

    if (this._reporterFileLookedUp) {
      return this._reporterFileLookedUpAndFound;
    }

    this._reporterFileLookedUp = true;

    if (!fs.existsSync(this.exePath)) {
      return false;
    }
    this._reporterFileLookedUpAndFound = true;
    return true;
  }

  // override this if a specific image reporter can support images
  canImageDiff() {
    return false;
  }

  canReportOn(fileName) {

    if (!this.isReporterAvailable()) {
      return false;
    }

    autils.assertFileExists(fileName);

    if (this.canImageDiff()) {
      return true;
    }

    var isBinary = autils.isBinaryFile(fileName);
    if (isBinary) {
      return false;
    }

    return true;
  }

  spawn(exe, args, cmdOptions) {
    return childProcess.spawn(exe, args, cmdOptions);
  }

  spawnSync(exe, args, cmdOptions) {
    return childProcess.spawnSync(exe, args, cmdOptions);
  }

  report(approved, received, options) {

    if (!options.blockUntilReporterExits) {
      if (reportingLaunchingCircuitBreaker.check(approved, received, options)) {
        return;
      }
    }

    const spawn = (options.blockUntilReporterExits ? this.spawnSync : this.spawn);
    autils.createEmptyFileIfNotExists(approved);

    var exe = this.exePath;
    var cmdOptions = options.cmdOptionOverrides;
    var args = options.cmdArgs || [received, approved];

    var cmdString = options.cmdString || [exe, args.join(' ')].join(' ');

    console.log('CMD: ', exe, args.join(' '));

    var result = spawn(exe, args, cmdOptions);

    if (result.status !== 0) {

      const stdOut = result.stdout ? ('\n\n============\nstd err:\n============\n' + result.stdout.toString() + "\n============\n") : '';
      const stdErr = result.stderr ? ('\n============\nstd out:\n============\n' + result.stderr.toString() + "\n============\n") : '';

      throw new Error(
        "Could not launch diff tool with command:\n\n" +
        "CMD> " + cmdString +
        stdOut +
        stdErr
      );
    }
  }

}

module.exports = GenericDiffReporterBase;
