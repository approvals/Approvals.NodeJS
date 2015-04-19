var _ = require("lodash");
var osTools = require("./osTools.js");

var defaultConfig = {
  reporters: ["opendiff", "p4merge", "tortoisemerge", "nodediff", "gitdiff"],
  appendEOL: osTools.isWindows ? true : false,
  EOL: require('os').EOL,
  errorOnStaleApprovedFiles: true,
  shouldIgnoreStaleApprovedFile: function() { return false; },
  stripBOM: false
};

// if someone tries to call 'require("approvals").configure()...' without calling ".mocha(...) or .jasmine(...) they won't get a helpful error. So we put this in there - just in case"
if (typeof beforeEach === "function"){
  beforeEach(function(){
    this.verify = function(){
      throw "You must call either .mocha(__dirname) or .jasmine(__dirname)";
    };
  });
}

exports.options = _.defaults({}, defaultConfig);

var listOfApprovedFiles = {};

process.on("approvalFileApproved", function(fileName){
  listOfApprovedFiles[fileName] = true;
});

process.on('exit', function() {

  if (exports.options.errorOnStaleApprovedFiles){
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
        r.push(o[i]);
      }
      return r;
    };

    var flatten = Function.prototype.apply.bind(Array.prototype.concat, []);

    Array.prototype.selectMany = function (fn) {
      return flatten(this.map(fn));
    };

    staleApprovals = listOfApprovedFiles
      .map(function(file){ return path.dirname(file);}) // get just the directory of each approved file.
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
        if (typeof exports.options.shouldIgnoreStaleApprovedFile === "function") {
          return !exports.options.shouldIgnoreStaleApprovedFile(file);
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

exports.configure = function (options) {
  var newConfig = _.defaults(options, defaultConfig);
  exports.options = newConfig;
  return exports;
};

exports.mocha = function (dir) {
  var Namer = require("./Providers/Mocha/MochaNamer.js");
  var baseVerifier = require("./Providers/BeforeEachVerifierBase.js");

  baseVerifier(Namer, "require('Approvals').mocha(__dirname);", exports.options, dir);

  return exports;
};

exports.jasmine = function (dir) {
  var Namer = require("./Providers/Jasmine/JasmineNamer.js");
  var baseVerifier = require("./Providers/BeforeEachVerifierBase.js");

  baseVerifier(Namer, "require('Approvals').jasmine(__dirname);", exports.options, dir);

  return exports;
};

exports.verify = function (dirName, testName, data, reporters) {
  var ManualNamer = require('./ManualNamer');
  var StringWriter = require("./StringWriter");
  var FileApprover = require("./FileApprover");
  var ReporterFactory = require("./Reporting/ReporterFactory");
  var options = exports.options;

  var namer = new ManualNamer(dirName, testName);
  var reporterFactory = function() {
    return ReporterFactory.loadReporter(reporters || options.reporters);
  };
  var writer = new StringWriter(options, data);
  FileApprover.verify(namer, writer, reporterFactory);
};

exports.verifyAsJSON = function(dirName, testName, data, reporters) {
  exports.verify(dirName, testName, JSON.stringify(data, null, '  '), reporters);
};
