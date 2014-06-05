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
    }
});

if(verbose) {
    console.log('parsed args: ', argv);
}

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

if(verbose) {
    console.log('testname: ', testname);
    console.log('reporters: ', reporters || 'undefined (but will fallback to approvals preconfigure defaults)');
}

var opts = {};
if(reporters) opts.reporters = reporters;

var approvals = require('../lib/approvals').configure(opts);


process.stdin.pipe(es.mapSync(function(data) {
    var dataToVerify = data.toString();
    approvals.verify(process.cwd(), testname, dataToVerify);
}));
