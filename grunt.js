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
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				node: true
			},
			globals: {
				exports: true
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