#!/usr/bin/env ts-node
/// <reference path="../typings/node/node.d.ts"/>
import chalk from 'chalk';
import es from 'event-stream';
import * as autils from '../lib/AUtils';
import fs from 'fs';
import path from 'path';
import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import minimist from 'minimist';
var approvals = require('../lib/Approvals');

const verbose = process.argv.includes('--verbose');
const printHelp = process.argv.includes('--help');

function printHelpMessage() {
    if (verbose) {
        console.log("printing help...");
    }

    const helpFile = fs.readFileSync(path.join(__dirname, 'help.md'), 'utf8');
    marked.setOptions({
        renderer: new TerminalRenderer()
    });
    let output = marked.parse(helpFile) as string;

    output = output.replace(/&nbsp;/g, ' ');
    console.log(output);
}

function errAndExit(msg: string): void {
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

const argv = minimist(process.argv.slice(2), {
    alias: {
        'reporters': ['r']
    },
    boolean: ['verbose']
});

if (verbose) {
    console.log('parsed args: ', argv);
}

let reporters = argv.reporter as string | string[];
if (typeof reporters === 'string') {
    reporters = [reporters];
}

const testname = argv._[0];
if (!testname) {
    errAndExit('Missing parameter: supply a test name ex: echo "hello" | approvals myFirstTest. This will become the file name myFirstTest.approved.txt in the current directory');
}

const outdir = argv.outdir || process.cwd();
if (!fs.existsSync(outdir)) {
    errAndExit('Directory not found: ' + outdir);
}

const errorOnStaleApprovedFiles = argv.errorOnStaleApprovedFiles === 'true';

if (verbose) {
    console.log('outdir: ', outdir);
    console.log('errorOnStaleApprovedFiles: ', errorOnStaleApprovedFiles);
    console.log('testname: ', testname);
    console.log('reporters: ', reporters || 'undefined (but will fallback to approvals preconfigure defaults)');
}

const opts: any = {};
if (reporters) {
    opts.reporters = reporters;
}
opts.errorOnStaleApprovedFiles = errorOnStaleApprovedFiles;

if (verbose) {
    console.log('approval opts: ', opts);
}

opts.forceApproveAll = autils.hasCommandLineArgument("--forceapproveall") || autils.hasCommandLineArgument("-f");

process.stdin.pipe(es.mapSync((data: Buffer) => {
    const dataToVerify = data.toString();
    approvals.configure(opts);
    approvals.verify(outdir, testname, dataToVerify);
}));
