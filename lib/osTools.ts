/// <reference path="../typings/node/node.d.ts"/>
'use strict';

var isWindows = (process.platform.indexOf('win') === 0);

exports.platform = {
  isWindows: isWindows,
  isMac: process.platform === 'darwin'
};

var findProgramPathCommand = "which";

if (isWindows) {
  findProgramPathCommand = "where";
}

exports.findProgramPathCommand = findProgramPathCommand;
