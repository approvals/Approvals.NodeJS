'use strict';

var fs = require('fs');
var path = require('path');
var shell = require('shelljs');
var osTools = require('./osTools');

var _cachedProgramLookups = {};

var createEmptyFileIfNotExists = function (file) {
  if (!fs.existsSync(file)) {

    var ext = (path.extname(file) || '').toLowerCase();

    if (ext === '.txt') {
      fs.writeFileSync(file, "");
    } else if (ext === '.png') {
      fs.writeFileSync(file, fs.readFileSync(path.join(__dirname, 'DummyApprovedFiles', 'UnapprovedImage.png')));
    } else {
      // TODO: what should the default approved type for this type of file?
    }
  }
};

var assertFileExists = function (file) {
  if (!fs.existsSync(file)) {
    throw new Error("File not found: " + file);
  }
};

var hasCommandLineArgument = function (arg) {
  return !!(process.argv || []).filter(function (val) {
    return (val || '').toLowerCase() === arg;
  }).length;
};

// copied and modified from http://stackoverflow.com/questions/10225399/check-if-a-file-is-binary-or-ascii-with-node-js
var isBinaryFile = function (buffer) {

  var charCode, contentStartUTF8, i, _i, _ref;
  contentStartUTF8 = buffer.toString('utf8', 0, 24);

  for (i = _i = 0, _ref = contentStartUTF8.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    charCode = contentStartUTF8.charCodeAt(i);
    if (charCode === 65533 || charCode <= 8) {
      return true;
    }
  }
  return false;
};

var trimExtension = function (filePath) {
  if (!filePath) {
    return filePath;
  }
  var i = filePath.lastIndexOf('.');
  var ext = (i < 0) ? '' : filePath.substr(i);
  if (ext) {
    return filePath.substring(0, filePath.length - ext.length);
  }
  return filePath;
};

var findProgramOnPath = function (programName) {

  // eslint-disable-next-line no-prototype-builtins
  if (_cachedProgramLookups.hasOwnProperty(programName)) {
    return _cachedProgramLookups[programName];
  }
  var output = shell.exec(osTools.findProgramPathCommand + " " + programName, { silent: true });

  var result = null;
  if (output) {
    var file = output.split("\n")[0].trim();

    var fixedFile = fixFilePathSlashes(file);
    if (fs.existsSync(fixedFile)) {
      result = fixedFile;
    }
  }

  if (!result) {
    var pathMinusExtension = trimExtension(programName);

    if (pathMinusExtension !== programName) {
      result = findProgramOnPath(pathMinusExtension);
    }
  }

  _cachedProgramLookups[programName] = result;
  return result;
};

var searchForExecutable = function (folderInProgramInFiles, fileName) {

  if (arguments.length === 1) {
    fileName = folderInProgramInFiles;
    folderInProgramInFiles = null;
  }

  var programOnPath = findProgramOnPath(fileName);
  if (programOnPath) {
    return programOnPath;
  }

  var searchedInPaths = [];

  //TODO: find a way to get at the environment variables for ProgramFiles and ProgramFiles(x86)
  // for now hard code it...

  function findInPath(root, dir, file) {
    var fullPath = path.join(root, dir, file);
    var fixedFullPath = fixFilePathSlashes(fullPath);

    searchedInPaths.push(fixedFullPath);

    if (fs.existsSync(fixedFullPath)) {
      return fixedFullPath;
    }
    return null;
  }

  function lookInProgramFiles(fileName_) {
    if (osTools.platform.isWindows) {
      var tryVar = findInPath("C:/Program Files", folderInProgramInFiles || '', fileName_);
      if (tryVar) {
        return tryVar;
      }

      tryVar = findInPath("C:/Program Files (x86)", folderInProgramInFiles || '', fileName_);
      if (tryVar) {
        return tryVar;
      }
    }

    return null;
  }

  var fileFound = lookInProgramFiles(fileName);
  if (fileFound) {
    return fileFound;
  }

  var suffix = ".exe";
  if (fileName.indexOf(suffix, fileName.length - suffix.length) === -1) {
    fileFound = lookInProgramFiles(fileName + ".exe");
    if (fileFound) {
      return fileFound;
    }
  }

  //	console.log("Searched in paths:", searchedInPaths);

  return null;
};

var fixFilePathSlashes = function (path_) {
  return (path_ || '').replace(/\\/g, '/');
};

var recursivelyOrderKeys = function(unordered) {
  if (unordered === null) {
    return null;
  }

  if (Array.isArray(unordered)) {
    unordered.forEach(function (item, index) {
      unordered[index] = recursivelyOrderKeys(item);
    });
    return unordered;
  }

  if (unordered !== null && typeof unordered === 'object') {
    var ordered = {};
    Object.keys(unordered).sort().forEach(function(key) {
      ordered[key] = recursivelyOrderKeys(unordered[key]);
    });
    return ordered;
  }

  return unordered;
};

var stringifyKeysInOrder = function(data) {
  var sortedData = recursivelyOrderKeys(data);
  return JSON.stringify(sortedData, null, '  ');
};

module.exports = {
  createEmptyFileIfNotExists: createEmptyFileIfNotExists,
  assertFileExists: assertFileExists,
  hasCommandLineArgument: hasCommandLineArgument,
  isBinaryFile: isBinaryFile,
  findProgramOnPath: findProgramOnPath,
  searchForExecutable: searchForExecutable,
  fixFilePathSlashes: fixFilePathSlashes,
  stringifyKeysInOrder: stringifyKeysInOrder
};
