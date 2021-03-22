'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const path = require('path');

const paths = {
  mochaTests: ['test/**/*[Tt]ests.js'],
  filesToLint: ['./lib/**/*.js', './test/**/*.js', 'gulpfile.js'],
  sourceJSFilesForCodeCoverage: ['./lib/**/*.js']
};

gulp.task('lint', function () {
  return gulp.src(paths.filesToLint)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('lint-watch', gulp.series('lint', function () {
  $.watch(paths.filesToLint, function () {
    gulp.start('lint');
  });
}));

gulp.task('unitTest', function() {
  return gulp.src(paths.mochaTests, { read: false })
    .pipe($.mocha({
      reporter: 'spec',
      slow: 500,
      timeout: 5000,
      //globals: {}
    }));
})

gulp.task('test', gulp.series('unitTest', done => {
  gulp.series('lint');
  done();
}));

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

gulp.task('coveralls', gulp.series('coverage', function () {
  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe($.coveralls())
    .on('error', function(err) {
      console.error(err);
    })
    .on('end', function () {
      console.log("Coverage published to coveralls.io");
    });
}));

gulp.task('default', gulp.series("test"));
