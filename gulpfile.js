var gulp = require('gulp');
var mocha = require('gulp-mocha');

var testPaths = ['test/**/*[Tt]ests.js']

var gulpMocha = gulp.src(testPaths, { read: false })
    .pipe(mocha({
        reporter: 'spec',
        slow: 200,
        timeout: 1000,
        globals: { }
    }));

gulp.task('default', function() {
  // place code for your default task here
  return gulpMocha;
});
