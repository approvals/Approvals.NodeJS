'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');

var paths = {
  mochaTests: ['test/**/*[Tt]ests.js'],
  filesToLint: ['./lib/**/*.js', './test/**/*.js', 'gulpfile.js'],
  sourceJSFilesForCodeCoverage: ['./lib/**/*.js']
};

gulp.task('lint-watch', ['lint'], function () {
  $.watch(paths.filesToLint, function () {
    gulp.start('lint');
  });
});

gulp.task('lint', function () {
  return gulp.src(paths.filesToLint)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('unitTest', function() {
  return gulp.src(paths.mochaTests, { read: false })
    .pipe($.mocha({
      reporter: 'spec',
      slow: 500,
      timeout: 5000,
      globals: {}
    }));
})

gulp.task('test', ['unitTest'], function () {
  gulp.start('lint');
});

gulp.task('coverage', function (cb) {
  gulp.src(paths.sourceJSFilesForCodeCoverage)
    .pipe($.istanbul()) // Covering files
    .pipe($.istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(paths.mochaTests, { read: false })
        .pipe($.mocha({
          reporter: 'dot',
          timeout: 5000
        }))
        .pipe($.istanbul.writeReports()) // Creating the reports after tests ran
        .on('finish', function () {
          process.chdir(__dirname);
          cb();
        });
    });
});

gulp.task('coveralls', ['coverage'], function () {
  if (!process.env.CI) {
    console.log("process.env.CI === {" + process.env.CI + "}. Skipping coveralls.");
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe($.coveralls())
    .on('error', function(err) {
      console.error(err);
    })
    .on('end', function () {
      console.log("Coverage published to coveralls.io");
    });
});

gulp.task('default', ["test"]);
