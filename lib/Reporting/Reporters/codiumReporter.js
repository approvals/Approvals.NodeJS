"use strict";

var autils = require("../../AUtils");
var GenericDiffReporterBase = require("../GenericDiffReporterBase");
var ostools = require("../../osTools");

class Reporter extends GenericDiffReporterBase {
  constructor() {
    super("codium");

    if (ostools.platform.isWindows) {
      this.exePath = autils.searchForExecutable("codium.cmd");
    } else {
      this.exePath = autils.searchForExecutable("codium");
    }
  }

  report(approved, received, options) {
    autils.createEmptyFileIfNotExists(approved);

    options.cmdArgs = ["-n", "--diff", received, approved];
    options.cmdOptionOverrides = {
      detached: true,
    };

    return super.report(approved, received, options);
  }
}

module.exports = Reporter;
