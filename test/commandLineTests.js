var shelljs = require('shelljs');
var path = require('path');

describe('Command Line', function () {

  describe('searchForExecutable', function () {
    it('Should run ./commandTest.sh', function () {
      var cliTestCommand = path.join(__dirname, './commandLine.sh');
      var output = shelljs.exec(cliTestCommand);
      if (output.code !== 0) {
        console.error(output);
        throw "cli script failed";
      }
    });
  });

});
