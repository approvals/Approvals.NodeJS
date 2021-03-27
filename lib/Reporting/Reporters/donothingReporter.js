'use strict';

class Reporter {
  constructor() {
    this.name = "DoNothing";
    this.exePath = "echo";
  }

  canReportOn () {
    return true;
  }

  report() {
    // Do nothing
  }

}

module.exports = Reporter;
