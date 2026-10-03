#!/usr/bin/env ts-node
import es from "event-stream";
import * as autils from "../lib/AUtils";
import fs from "fs";
import path from "path";
import { stripVTControlCharacters } from "node:util";
import { marked, type Tokens } from "marked";
import { createTerminalRenderer, darkTheme } from "marked-terminal-renderer";
import Table from "cli-table3";
import minimist from "minimist";
import { configure, verify } from "../lib/Approvals";
import { redText } from "../lib/Utilities/ConsoleUtils";

const verbose = process.argv.includes("--verbose");
const printHelp = process.argv.includes("--help");

async function printHelpMessage(): Promise<void> {
  if (verbose) {
    console.log("printing help...");
  }

  const helpFile = fs.readFileSync(path.join(__dirname, "help.md"), "utf8");
  const terminalWidth = process.stdout.columns;
  const effectiveTerminalWidth =
    Number.isFinite(terminalWidth) && terminalWidth > 0 ? terminalWidth : 80;
  const tableWidth = Math.max(12, Math.min(100, effectiveTerminalWidth));
  // Reserve three columns for the table borders and keep descriptions readable.
  const argumentWidth = Math.min(26, Math.floor((tableWidth - 3) * 0.4));
  marked.use(createTerminalRenderer(darkTheme({ lineLength: tableWidth })), {
    renderer: {
      // Keep the CLI's existing help layout when changing terminal renderers.
      heading({ depth, tokens }) {
        return (
          "#".repeat(depth) + " " + this.parser.parseInline(tokens) + "\n\n"
        );
      },
      code({ text }) {
        return (
          text
            .split("\n")
            .map((line) => "    " + line)
            .join("\n") + "\n\n"
        );
      },
      link({ href, tokens }) {
        return this.parser.parseInline(tokens) + " (" + href + ")";
      },
      table({ header, rows }) {
        const renderCell = (cell: Tokens.TableCell) =>
          stripVTControlCharacters(this.parser.parseInline(cell.tokens));
        const table = new Table({
          head: header.map(renderCell),
          colWidths: [argumentWidth, tableWidth - argumentWidth - 3],
          wordWrap: true,
          wrapOnWordBoundary: false,
        });
        table.push(...rows.map((row) => row.map(renderCell)));
        return table.toString() + "\n\n";
      },
    },
  });
  let output = await marked.parse(helpFile);

  output = output.replace(/&nbsp;/g, " ");
  console.log(output);
}

async function errAndExit(msg: string): Promise<void> {
  await printHelpMessage();
  console.log(redText(msg));
  process.exit(1);
}

async function main(): Promise<void> {
  if (printHelp) {
    await printHelpMessage();
    process.exit();
  }

  if (verbose) {
    console.log("process.argv: ", process.argv);
  }

  const argv = minimist(process.argv.slice(2), {
    alias: {
      reporters: ["r"],
    },
    boolean: ["verbose"],
  });

  if (verbose) {
    console.log("parsed args: ", argv);
  }

  let reporters = argv.reporter as string | string[];
  if (typeof reporters === "string") {
    reporters = [reporters];
  }

  const testname = argv._[0];
  if (!testname) {
    await errAndExit(
      'Missing parameter: supply a test name ex: echo "hello" | approvals myFirstTest. This will become the file name myFirstTest.approved.txt in the current directory',
    );
  }

  const outdir = argv.outdir || process.cwd();
  if (!fs.existsSync(outdir)) {
    await errAndExit("Directory not found: " + outdir);
  }

  const errorOnStaleApprovedFiles = argv.errorOnStaleApprovedFiles === "true";

  if (verbose) {
    console.log("outdir: ", outdir);
    console.log("errorOnStaleApprovedFiles: ", errorOnStaleApprovedFiles);
    console.log("testname: ", testname);
    console.log(
      "reporters: ",
      reporters ||
        "undefined (but will fallback to approvals preconfigure defaults)",
    );
  }

  const opts: any = {};
  if (reporters) {
    opts.reporters = reporters;
  }
  opts.errorOnStaleApprovedFiles = errorOnStaleApprovedFiles;

  if (verbose) {
    console.log("approval opts: ", opts);
  }

  opts.forceApproveAll =
    autils.hasCommandLineArgument("--forceapproveall") ||
    autils.hasCommandLineArgument("-f");

  process.stdin.pipe(
    es.mapSync((data: Buffer) => {
      const dataToVerify = data.toString();
      configure(opts);
      verify(outdir, testname, dataToVerify);
    }),
  );
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
