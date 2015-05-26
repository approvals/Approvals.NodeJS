'use strict';

var _ = require("lodash");
var cfg = require('./config');

// if someone tries to call 'require("approvals")...' without calling ".mocha(...) or .
// jasmine(...) they won't get a helpful error. So we put this in there - just in case"
if (typeof beforeEach === "function"){
  beforeEach(function(){
    this.verify = function(){
      throw "You must call either .mocha(__dirname) or .jasmine(__dirname)";
    };
  });
}

var listOfApprovedFiles = {};

process.on("approvalFileApproved", function(fileName){
  listOfApprovedFiles[fileName] = true;
});

process.on('exit', function() {
  var options = cfg.currentConfig();

  if (options.errorOnStaleApprovedFiles) {
    var path = require('path');
    var glob = require('glob');

    var staleApprovals = [];

    listOfApprovedFiles = Object.keys(listOfApprovedFiles).map(function(file){
      return file.replace(/\\/g, "/");
    });

    Array.prototype.unique = function() {
      var o = {}, i, l = this.length, r = [];
      for (i = 0; i < l; i += 1) {
        o[this[i]] = this[i];
      }
      for (i in o) {
        if (o.hasOwnProperty(i)) {
          r.push(o[i]);
        }
      }
      return r;
    };

    var flatten = Function.prototype.apply.bind(Array.prototype.concat, []);

    Array.prototype.selectMany = function (fn) {
      return flatten(this.map(fn));
    };

    staleApprovals = listOfApprovedFiles
      .map(function(file){ return path.dirname(file); }) // get just the directory of each approved file.
      .unique() // hmm only unique directories
      .map(function(folder){
        return glob.sync(folder + "**/*.approved.*").filter(function(file){
          return !listOfApprovedFiles[file];
        });
      }) // use 'glob' to find all .approved.* files for each folder.
      .selectMany(function(files){
        return files;
      }) // turn the array of array's into a single array of strings.
      .filter(function(file){
        if (typeof options.shouldIgnoreStaleApprovedFile === "function") {
          return !options.shouldIgnoreStaleApprovedFile(file);
        }
        return true;
      })
      .filter(function(item){
        return listOfApprovedFiles.indexOf(item) < 0;
      }); // only pull the ones that aren't already in the 'listOfApprovedFiles'

    if (staleApprovals.length){
      throw 'ERROR: Found stale approvals files: \n  - ' + staleApprovals.join('\n  - ') + '\n';
    }
  }

});

exports.configure = function (overrideOptions) {
  cfg.configure(overrideOptions);
  return exports;
};

exports.mocha = function (dir) {
  var Namer = require("./Providers/Mocha/MochaNamer.js");
  var baseVerifier = require("./Providers/BeforeEachVerifierBase.js");

  baseVerifier(Namer, "require('Approvals').mocha(__dirname);", dir);

  return exports;
};

exports.jasmine = function (dir) {
  var Namer = require("./Providers/Jasmine/JasmineNamer.js");
  var baseVerifier = require("./Providers/BeforeEachVerifierBase.js");

  baseVerifier(Namer, "require('Approvals').jasmine(__dirname);", dir);

  return exports;
};

exports.verify = function (dirName, testName, data, optionsOverride) {

  // backwards compatable option
  if (_.isArray(optionsOverride)) {
    optionsOverride = {
      reporters: optionsOverride
    };
    var stringReporters = JSON.stringify(optionsOverride.reporters);
    console.error("For the last arg of the approvals.verify(...) function, if you passed in an array of reporters, something like [\"opendiff\",\"nodediff\"], this has been deprecated and replaced by passing in a config object. Please re-evaluate if you can remove this parameter alltogether and use individual user configs in ~/.approvalConfig, if not then replace this: " + stringReporters + " with this { reporters: " + stringReporters + "}.");
  }

  var newOptions = cfg.configure(optionsOverride);
  var ManualNamer = require('./ManualNamer');
  var StringWriter = require("./StringWriter");
  var FileApprover = require("./FileApprover");
  var ReporterFactory = require("./Reporting/ReporterFactory");

  var namer = new ManualNamer(dirName, testName);
  var reporterFactory = function() {
    return ReporterFactory.loadReporter(newOptions.reporters);
  };
  var writer = new StringWriter(newOptions, data);
  FileApprover.verify(namer, writer, reporterFactory, newOptions);
};

exports.verifyAsJSON = function(dirName, testName, data, optionsOverride) {
  exports.verify(dirName, testName, JSON.stringify(data, null, '  '), optionsOverride);
};
