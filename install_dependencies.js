var spawn = require('child_process').spawn;
var isWin = !!process.platform.match(/^win/);

console.log();

if (isWin) {
  var cmd = spawn('npm.cmd', ['install', 'edge'], { cwd: __dirname });

  cmd.stdout.on('data', function (data) {
    console.log('' + data);
  });

  cmd.stderr.on('data', function (data) {
    console.log('' + data);
  });

  cmd.on('close', function (code) {
    console.log('npm install edge - completed with exit code - ' + code);
  });

}
