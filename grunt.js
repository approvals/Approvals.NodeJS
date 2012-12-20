module.exports = function (grunt) {

	// Add our custom tasks.
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		test: {
			files: ['test/**/*.js']
		},
		lint: {
			files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'default'
		},
		jshint: {
			options: {
				"es5": true,
				"boss": true,
				"node": true,
				"strict": false, // TODO: Research
				"white": true,
				"smarttabs": true,
				"maxlen": 100,
				"newcap": false,
				"undef": true,
				"unused": true,
				"onecase": true,
				"indent": 2
			},
			globals: {
				exports: true,

				//// mocha globals
				describe: false,
				it: true
			}
		},
		simplemocha: {
			dev: {
				src: ['test/**/*[Tt]ests.js'],
				options: {
					reporter: 'spec',
					slow: 200,
					timeout: 1000
				}
			}
		},
		watch: {
			all: {
				files: ['lib/*', 'test/*.js'],
				tasks: ['test']
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint simplemocha');

	grunt.registerTask('test', 'simplemocha:dev');
};