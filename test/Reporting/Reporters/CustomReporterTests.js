'use strict';

/// <reference path="../../../typings/node/node.d.ts"/>
/// <reference path="../../../typings/mocha/mocha.d.ts"/>
var expect = require('chai').expect;

var assert = require('assert');
var MyCustomReporter = function () {
  var wasReporterUsed = false;
  return {
    canReportOn: function(/*file*/){
      return true;
    },
    report: function(/*approved, received*/){
      wasReporterUsed = true;
    },
    getWasReporterUsed: function(){
      return wasReporterUsed;
    },
    name: "globalCustomReporter"
  };
};

var globalCustomReporter = MyCustomReporter();

var approvals = require('../../../lib/Approvals').mocha(__dirname);

describe("CustomReporter", function  () {
  it("allows CustomReporter at method level", function  () {

    var calledCustomReporter = false;

    try {
      this.verify('foo', {
        errorOnStaleApprovedFiles: false,
        reporters: [{
          canReportOn: function(/*file*/){
            return true;
          },
          report: function(/*approved, received*/){
            calledCustomReporter = true;
          }
        }]
      });

    } catch (err) {
    }

    assert.ok(calledCustomReporter);
  });

  it("uses global custom reporter", function(){
    approvals.configure({
      reporters: [globalCustomReporter],
      errorOnStaleApprovedFiles: false
    });

    try {
      this.verify('foo');
    } catch (err) {

    }

    assert.ok(globalCustomReporter.getWasReporterUsed());
  });

  it("uses global custom reporter manual verify", function(){
    approvals.configure({
      reporters: [globalCustomReporter],
      errorOnStaleApprovedFiles: false
    });

    var didRaiseException = false;
    try {
      approvals.verify(__dirname, "CustomReporter.uses_global_custom_reporter_manual_verify", 'foo');
    } catch (err) {
      didRaiseException = true;
    }

    expect(didRaiseException).to.equal(true);

    assert.ok(globalCustomReporter.getWasReporterUsed());
  });

  it("uses global custom reporter 2", function(){
    approvals.configure({
      reporters: [globalCustomReporter],
      errorOnStaleApprovedFiles: false
    });

    var reporter = this.approvals.getCurrentReporter();

    assert.equal(reporter.name, "globalCustomReporter");
  });

});
