import fs from "fs";
import path from "path";

import jsdoc2md from "jsdoc-to-markdown";

import * as approvals from "../../lib/Approvals.js";
import { StringWriter } from "../../lib/StringWriter.js";

import { testDirectory } from "./testPaths.mjs";

function nestHeadingsUnderCliHelpSection(markdown: string): string {
  return markdown.replace(/^(#+) /gm, "###$1 ");
}

describe("Readme", function () {
  it("Should not allow the readme docs to get out of sync", async function () {
    const currentReadme = fs
      .readFileSync(path.join(testDirectory, "../../", "readme.md"))
      .toString();
    const cliDocsRaw = nestHeadingsUnderCliHelpSection(
      fs
        .readFileSync(path.join(testDirectory, "../../bin", "help.md"))
        .toString(),
    );

    const approvalsSource = fs
      .readFileSync(path.join(testDirectory, "../../lib", "Approvals.js"))
      .toString();

    let jsdocsOutput = await jsdoc2md.render({
      source: approvalsSource,
      "no-cache": true,
    });
    jsdocsOutput = jsdocsOutput
      .split("\n")
      .map(function (line) {
        return line.replace(/\s+$/, "");
      })
      .join("\n");

    let newDocs = "<!--BEGIN-API-DOCS-->";
    newDocs += "\n<!-- GENERATED - DO NOT MODIFY API DOCS IN THIS README -->";
    newDocs += "\n<!-- Update docs in the source ./lib/Approvals.js -->";
    newDocs += "\n\n" + jsdocsOutput;
    newDocs += "\n\n<!--END-API-DOCS-->";

    let cliDocs = "<!--BEGIN-CLI-DOCS-->";
    cliDocs += "\n<!-- GENERATED - DO NOT MODIFY CLI DOCS IN THIS README -->";
    cliDocs += "\n<!-- Update docs in the source ./bin/help.md -->";
    cliDocs += "\n\n" + cliDocsRaw.trimEnd();
    cliDocs += "\n\n<!--END-CLI-DOCS-->";

    let reporterList = "<!--BEGIN-REPORTERS-LIST-->";
    reporterList += "\n<!-- GENERATED - DO NOT MODIFY THIS LIST -->";
    reporterList +=
      "\n<!-- Auto-Generated from folder of reporters in ./lib/Reporting/Reporters/* -->";
    reporterList += "\n```";
    reporterList += "\n[";
    reporterList +=
      '\n    "' +
      fs
        .readdirSync(path.join(testDirectory, "../../lib/Reporting/Reporters"))
        .map(function (item) {
          return item.substr(0, item.indexOf("Reporter.js"));
        })
        .join('",\n    "') +
      '"';
    reporterList += "\n]";
    reporterList += "\n```";
    reporterList += "\n<!--END-REPORTERS-LIST-->";

    const resultingReadme = currentReadme
      .replace(/<!--BEGIN-API-DOCS-->[\s\S]*<!--END-API-DOCS-->/gm, newDocs)
      .replace(/<!--BEGIN-CLI-DOCS-->[\s\S]*<!--END-CLI-DOCS-->/gm, cliDocs)
      .replace(
        /<!--BEGIN-REPORTERS-LIST-->[\s\S]*<!--END-REPORTERS-LIST-->/gm,
        reporterList,
      );

    const config = approvals.getConfig();
    config.EOL = "\n";
    config.normalizeLineEndingsTo = "\n";
    console.log(config);

    const writer = new StringWriter(
      config,
      resultingReadme.replace(/(?:\r\n|\r|\n)/g, "\n"),
    );
    const namer = {
      getReceivedFile: function () {
        return path.join(testDirectory, "../..", "readme.received.md");
      },
      getApprovedFile: function () {
        return path.join(testDirectory, "../..", "readme.md");
      },
    };

    approvals.verifyWithControl(namer, writer, null, config);
  });
});
