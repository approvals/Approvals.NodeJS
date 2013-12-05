var os = require('os');
var spawn = require('child_process').spawn;

var isWin = !!process.platform.match(/^win/);

console.log();

if(isWin) {
    var ls = spawn('npm.cmd', ['install', 'edge'], { cwd: __dirname });

    ls.stdout.on('data', function (data) {
        console.log('' + data);
    });

    ls.stderr.on('data', function (data) {
        console.log('' + data);
    });

    ls.on('close', function (code) {
        console.log('npm install edge - completed with exit code - ' + code);
    });

}
else {
	console.error("not npm installing edge as it's only used on windows");
}
