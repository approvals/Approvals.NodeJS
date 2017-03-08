var path = require('path');
var fs = require('fs');

var StringWriter = require("../lib/StringWriter");
var approvals = require('../lib/Approvals');
var jsdoc2md = require('jsdoc-to-markdown');

describe("Readme", function () {

  it("Should not allow the readme docs to get out of sync", function () {

    var currentReadme = fs.readFileSync(path.join(__dirname, '../', 'readme.md')).toString()
    var cliDocsRaw = fs.readFileSync(path.join(__dirname, '../bin', 'help.md')).toString()

    cliDocsRaw = cliDocsRaw
      .replace(/&nbsp;/g, ' ')
      .replace(/\*\*/g, '');

    var approvalsSource = fs.readFileSync(path.join(__dirname, '../lib', 'Approvals.js')).toString();

    var jsdocsOutput = jsdoc2md.renderSync({ source: approvalsSource, 'no-cache': true})
    jsdocsOutput = jsdocsOutput.split('\n').map(function (line) {
      return line.replace(/\s+$/, '');
    }).join('\n');

    var newDocs = "<!--BEGIN-API-DOCS-->";
    newDocs += "\n<!-- GENERATED - DO NOT MODIFY API DOCS IN THIS README -->";
    newDocs += "\n<!-- Update docs in the source ./lib/Approvals.js -->";
    newDocs += "\n\n" + jsdocsOutput;
    newDocs += "\n\n<!--END-API-DOCS-->";

    var cliDocs = "<!--BEGIN-CLI-DOCS-->";
    cliDocs += "\n<!-- GENERATED - DO NOT MODIFY API DOCS IN THIS README -->";
    cliDocs += "\n<!-- Update docs in the source ./bin/help.md -->";
    cliDocs += "\n```";
    cliDocs += "\n\n" + cliDocsRaw;
    cliDocs += "\n```";
    cliDocs += "\n\n<!--END-CLI-DOCS-->";


    var reporterList = "<!--BEGIN-REPORTERS-LIST-->";
    reporterList += "\n<!-- GENERATED - DO NOT MODIFY THIS LIST -->";
    reporterList += "\n<!-- Auto-Generated from folder of reporters in ./lib/Reporting/Reporters/* -->";
    reporterList += "\n```";
    reporterList += "\n[";
    reporterList += '\n    "' + fs.readdirSync(path.join(__dirname, '../lib/Reporting/Reporters')).map(function (item) {
      return item.substr(0, item.indexOf('Reporter.js'));
    }).join("\",\n    \"") + '"';
    reporterList += "\n]";
    reporterList += "\n```";
    reporterList += "\n<!--END-REPORTERS-LIST-->";

    var resultingReadme = currentReadme
      .replace(/<!--BEGIN-API-DOCS-->[\s\S]*<!--END-API-DOCS-->/gm, newDocs)
      .replace(/<!--BEGIN-CLI-DOCS-->[\s\S]*<!--END-CLI-DOCS-->/gm, cliDocs)
      .replace(/<!--BEGIN-REPORTERS-LIST-->[\s\S]*<!--END-REPORTERS-LIST-->/gm, reporterList);


    var config = approvals.getConfig();
    config.EOL = '\n';
    config.normalizeLineEndingsTo = '\n';
    console.log(config);

    var writer = new StringWriter(config, resultingReadme);
    var namer = {
      getReceivedFile: function () { return path.join(__dirname, '..', "readme.received.md"); },
      getApprovedFile: function () { return path.join(__dirname, '..', "readme.md"); }
    }

    approvals.verifyWithControl(namer, writer, null, config);
  });

});
