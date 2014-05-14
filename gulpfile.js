var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');

var paths = {
    mochaTests: ['test/**/*[Tt]ests.js'],
    jasmineTests: ['test/**/*.Spec.js'],
}

gulp.task('jshint', function(){
	return gulp.src(["lib/**/*.js", "test/**/*.js"])
	    .pipe(jshint())
		.pipe(jshint.reporter('default'))
});    

gulp.task('test', function(){
	return gulp.src(paths.mochaTests, { read: false })
	    	.pipe(mocha({
		        reporter: 'spec',
		        slow: 500,
		        timeout: 2000,
		        globals: { }
		    }));
});    


gulp.task('default', ["test", "jshint"]);
