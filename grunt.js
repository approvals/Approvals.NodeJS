module.exports = function (grunt) {

	// Add our custom tasks.
	grunt.loadNpmTasks('grunt-mocha-test');

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
		mochaTest: {
			normal: ['test/**/*[Tt]ests.js']
			//, withTimeout: ['test-timeout/**/*.test.js']
		},
		mochaTestConfig: {
			normal: {
				options: {
					reporter: 'nyan'
				}
			},
			withTimeout: {
				options: {
					reporter: 'nyan',
					timeout: 1000
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint test');

};