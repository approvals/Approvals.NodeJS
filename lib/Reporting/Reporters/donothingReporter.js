'use strict';

var Reporter = function () {
  this.name = "DoNothing";
  this.exePath = "echo";
};

Reporter.prototype.canReportOn = function () {
  return true;
};

Reporter.prototype.report = function () {
  // Do nothing
};

module.exports = Reporter;
