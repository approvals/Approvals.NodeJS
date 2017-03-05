#!/usr/bin/env node
/// <reference path="../typings/node/node.d.ts"/>
'use strict';

var chalk = require('chalk');
var es = require('event-stream');
var autils = require('../lib/AUtils');

var verbose = process.argv.indexOf('--verbose') >= 0;
var printHelp = process.argv.indexOf('--help') >= 0;

function printHelpMessage(){

  if (verbose) {
    console.log("printing help...");
  }

  var helpFile = require('path').join(__dirname, 'help.md');
  var output = require('msee').parseFile(helpFile);

  // Some spacing formatting cleanup
  output = output.replace(/&nbsp;/g, ' ');
  console.log(output);
}

function errAndExit(msg) {
  printHelpMessage();
  console.log(chalk.red(msg));
  process.exit(1);
}

if (printHelp) {
  printHelpMessage();
  process.exit();
}

if (verbose) {
  console.log('process.argv: ', process.argv);
}

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    'reporters': ['r']
  },
  boolean: ['verbose']
});
if (verbose) {
  console.log('parsed args: ', argv);
}

var reporters = argv.reporter;
if (typeof reporters === 'string') {
  // single argument case is a string - multiple is an array already
  reporters = [reporters];
}

var testname = argv._[0];
if (!testname) {
  errAndExit('Missing parameter: supply a test name ex: echo "hello" | approvals myFirstTest. This will become the file name myFirstTest.approved.txt in the current directory');
}

var outdir = argv.outdir || process.cwd();
if (!require('fs').existsSync(outdir)) {
  errAndExit('Directory not found: ' + outdir);
}

// we don't want to error on stale approved files by default because this basically runs 1 test at a time
// and we would end up with a bunch of noise.
var errorOnStaleApprovedFiles = argv.errorOnStaleApprovedFiles === 'true';

if (verbose) {
  console.log('outdir: ', outdir);
  console.log('errorOnStaleApprovedFiles: ', errorOnStaleApprovedFiles);
  console.log('testname: ', testname);
  console.log('reporters: ', reporters || 'undefined (but will fallback to approvals preconfigure defaults)');
}

var opts = {};
if (reporters) {
  opts.reporters = reporters;
}
opts.errorOnStaleApprovedFiles = errorOnStaleApprovedFiles;

if (verbose) {
  console.log('approval opts: ', opts);
}

// TODO: add other approval options in... or find a way to dynamically add them.

var approvals = require('../lib/Approvals');

opts.forceApproveAll = !!(autils.hasCommandLineArgument("--forceapproveall") || autils.hasCommandLineArgument("-f"));

// now capture standard in and verify against it
process.stdin.pipe(es.mapSync(function(data) {
  var dataToVerify = data.toString();
  approvals.verify(outdir, testname, dataToVerify, opts);
}));
