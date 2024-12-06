"use strict";

import gulp from "gulp";
import mocha from 'gulp-mocha';
import eslint from 'gulp-eslint';

import * as gulp_load_plugins from "gulp-load-plugins";

const $ = gulp_load_plugins;

const paths = {
  mochaTests: ["test/**/*[Tt]ests.js", "test/**/*[Tt]ests.mjs"],
  filesToLint: ["./lib/**/*.js", "./test/**/*.js", "gulpfile.mjs"],
  sourceJSFilesForCodeCoverage: ["./lib/**/*.js"],
};

gulp.task("lint", function () {
  return gulp
    .src(paths.filesToLint)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task(
  "lint-watch",
  gulp.series("lint", function () {
    $.watch(paths.filesToLint, function () {
      gulp.start("lint");
    });
  }),
);

gulp.task("unitTest", function () {
  return gulp.src(paths.mochaTests, { read: false }).pipe(
    mocha({
      reporter: "spec",
      slow: 500,
      timeout: 5000,
      //globals: {}
    }),
  );
});

gulp.task("test", gulp.series("unitTest", "lint"));

gulp.task("coverage", function (cb) {
  gulp
    .src(paths.sourceJSFilesForCodeCoverage)
    .pipe($.istanbul()) // Covering files
    .pipe($.istanbul.hookRequire())
    .on("finish", function () {
      gulp
        .src(paths.mochaTests, { read: false })
        .pipe(
          $.mocha({
            reporter: "dot",
            timeout: 5000,
          }),
        )
        .pipe($.istanbul.writeReports()) // Creating the reports after tests ran
        .on("finish", function () {
          process.chdir(__dirname);
          cb();
        });
    });
});

gulp.task("default", gulp.series("test"));
