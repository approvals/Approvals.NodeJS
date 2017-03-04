var path = require('path');
var fs = require('fs');

var StringWriter = require("../lib/StringWriter");
var ReporterFactory = require("../lib/Reporting/ReporterFactory");
var approvals = require('../lib/Approvals');
var jsdoc2md = require('jsdoc-to-markdown');

describe("Readme", function () {

  it("Should not allow the readme docs to get out of sync", function () {

    var currentReadme = fs.readFileSync(path.join(__dirname, '../', 'readme.md')).toString()

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

    var reporterList = "<!--BEGIN-REPORTERS-LIST-->";
    reporterList += "\n<!-- GENERATED - DO NOT MODIFY THIS LIST -->";
    reporterList += "\n<!-- Auto-Generated from folder of reporters in ./lib/Reporting/Reporters/* -->";
    reporterList += '\n"' + fs.readdirSync(path.join(__dirname, '../lib/Reporting/Reporters')).map(function (item) {
      return item.substr(0, item.indexOf('Reporter.js'));
    }).join("\",\n    \"") + '"';
    reporterList += "\n<!--END-REPORTERS-LIST-->";

    var resultingReadme = currentReadme
      .replace(/<!--BEGIN-API-DOCS-->[\s\S]*<!--END-API-DOCS-->/gm, newDocs)
      .replace(/<!--BEGIN-REPORTERS-LIST-->[\s\S]*<!--END-REPORTERS-LIST-->/gm, reporterList);


    var config = approvals.getConfig();

    var writer = new StringWriter(config, resultingReadme);
    var namer = {
      getReceivedFile: function () { return path.join(__dirname, '..', "readme.received.md"); },
      getApprovedFile: function () { return path.join(__dirname, '..', "readme.md"); }
    }

    var reporterFactory = function () {
      return [ReporterFactory.loadReporter(config.reporters)];
    };
    approvals.verifyWithControl(namer, writer, reporterFactory, config);
  });

});
