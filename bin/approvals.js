#!/usr/bin/env node
'use strict';

var chalk = require('chalk');
var es = require('event-stream');

var verbose = process.argv.indexOf('--verbose') >= 0

if(verbose) console.log('process.argv: ', process.argv);

var cliPackage = require('../package');

var argv = require('minimist')(process.argv.slice(2), { 
    alias: {
        'reporters': ['r']
    },
    boolean: ['verbose']
});
if(verbose) console.log('parsed args: ', argv);


function errAndExit(msg) {
    console.log(chalk.red(msg));
    process.exit(1);
}

var reporters = argv.reporter;

if(typeof reporters === 'string') {
    reporters = [reporters];
}

if(reporters) {
    if(!Array.isArray(reporters)) {
        errAndExit("reporters argument must be an array of reporters. TODO: print sample");
    }
}

var testname = argv._[0];
if(!testname) {
    errAndExit('Missing parameter: stupply a test name ex: echo "hello" | approvals myFirstTest. This will become the file name myFirstTest.approved.txt in the current directory');
}

var outdir = argv.outdir || process.cwd();
if(!require('fs').existsSync(outdir)) {
    errAndExit('Directory not found: ' + outdir);
}

var errorOnStaleApprovedFiles = argv.errorOnStaleApprovedFiles === 'true';

if(verbose) console.log('outdir: ', outdir);
if(verbose) console.log('errorOnStaleApprovedFiles: ', errorOnStaleApprovedFiles);
if(verbose) console.log('testname: ', testname);
if(verbose) console.log('reporters: ', reporters || 'undefined (but will fallback to approvals preconfigure defaults)');

var opts = {};
if(reporters) opts.reporters = reporters;
opts.errorOnStaleApprovedFiles = errorOnStaleApprovedFiles;

if(verbose) console.log('approval opts: ', opts);

// TODO: add other approval options in... or find a way to dynamically add them.

var approvals = require('../lib/approvals').configure(opts);

// now capture standard in and verify against it
process.stdin.pipe(es.mapSync(function(data) {
    var dataToVerify = data.toString();
    approvals.verify(outdir, testname, dataToVerify);
}));

