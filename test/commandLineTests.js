var shelljs = require('shelljs');
var path = require('path');

describe('Command Line', function () {

  it('Should run approvals CLI with basic text input', function (done) {
    var cliTestCommand = 'echo "Hello\nWorld" | ' + path.join('./', 'bin', 'index.js') + ' --reporter gitdiff --outdir ./test commandlineTest';

    shelljs.exec(cliTestCommand, {async:true}, function (code, output) {
      if (code !== 0) {
        console.error('code:', code, 'output:', output);
        throw "cli script failed";
      }
      done();
    });
  });

});
