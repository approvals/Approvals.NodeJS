var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
  mochaTests: ['test/**/*[Tt]ests.js'],
  jasmineTests: ['test/**/*.Spec.js'],
  filesToLint: ['./lib/**/*.js', './test/**/*.js', 'gulpfile.js']
};

gulp.task('jscs', function() {
  return gulp.src(paths.filesToLint)
  .pipe($.jscs());
});

gulp.task('jscs-watch', function() {
  gulp.start('jscs');
  $.watch(paths.filesToLint, function () {
    gulp.start('jscs');
  });
});

gulp.task('jshint', function() {
  return gulp.src(["lib/**/*.js", "test/**/*.js"])
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('test', function(){
  return gulp.src(paths.mochaTests, { read: false })
  .pipe($.mocha({
    reporter: 'spec',
    slow: 500,
    timeout: 2000,
    globals: { }
  }));
});

gulp.task('default', ["test", "jshint"]);
