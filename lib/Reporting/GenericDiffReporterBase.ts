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
    const process = childProcess.spawn(exe, args, cmdOptions);

    let stdout = '';
    let stderr = '';

    process.stdout.on("data", (data) => {

      stdout += data;

    });
    process.stderr.on("data", (data) => {

      stderr += data;

    });

    process.on("close", () => {

      if (stdout) {
        console.log('\n============\nstdout:\n============\n' + stdout + "\n============\n");
      }

      if (stderr) {
        console.log('\n============\nstderr:\n============\n' + stderr + "\n============\n");
      }

    });

    return;

  }

  spawnSync(exe, args, cmdOptions) {

    const result = childProcess.spawnSync(exe, args, cmdOptions);

    const stdout = result.stdout.toString();
    const stderr = result.stderr.toString();

    if (stdout) {
      console.log('\n============\nstdout:\n============\n' + stdout + "\n============\n");
    }

    if (stderr) {
      console.log('\n============\nstderr:\n============\n' + stderr + "\n============\n");
    }

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

    console.log('CMD: ', exe, args.join(' '));

    spawn(exe, args, cmdOptions);

  }

}

module.exports = GenericDiffReporterBase;
