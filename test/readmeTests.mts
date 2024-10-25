import path from "path";
import fs from "fs";
import {StringWriter} from "../lib/StringWriter.js";
import * as approvals from "../lib/Approvals.js";
import jsdoc2md from "jsdoc-to-markdown";
import {testDirectory} from "./testPaths.mjs";

describe("Readme", function () {
  it("Should not allow the readme docs to get out of sync", function () {
    const currentReadme = fs
      .readFileSync(path.join(testDirectory, "../", "readme.md"))
      .toString();
    let cliDocsRaw = fs
      .readFileSync(path.join(testDirectory, "../bin", "help.md"))
      .toString();

    cliDocsRaw = cliDocsRaw.replace(/&nbsp;/g, " ").replace(/\*\*/g, "");

    const approvalsSource = fs
      .readFileSync(path.join(testDirectory, "../lib", "Approvals.js"))
      .toString();

    let jsdocsOutput = jsdoc2md.renderSync({
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
    cliDocs += "\n<!-- GENERATED - DO NOT MODIFY API DOCS IN THIS README -->";
    cliDocs += "\n<!-- Update docs in the source ./bin/help.md -->";
    cliDocs += "\n```";
    cliDocs += "\n\n" + cliDocsRaw;
    cliDocs += "\n```";
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
        .readdirSync(path.join(testDirectory, "../lib/Reporting/Reporters"))
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
        return path.join(testDirectory, "..", "readme.received.md");
      },
      getApprovedFile: function () {
        return path.join(testDirectory, "..", "readme.md");
      },
    };

    approvals.verifyWithControl(namer, writer, null, config);
  });
});
