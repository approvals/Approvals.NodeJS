'use strict';

var DoNothingReporter = function () {
  this.name = "DoNothing";
  this.exePath = "echo";
};

DoNothingReporter.prototype.canReportOn = function () {
  return true;
};

DoNothingReporter.prototype.report = function () {
  // Do nothing
};

module.exports = DoNothingReporter;
