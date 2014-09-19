module.exports = function (grunt) {
	// Displays the elapsed execution time of grunt tasks
	require('time-grunt')(grunt);
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-include-replace');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-node-webkit-builder');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			grunt: {
				files: ['Gruntfile.js'],
				tasks: ['clean','sass:dev','jshint','requirejs:dev','includereplace:dev']
			},
			foldline: {
				files: ['sass/fold-line.{scss,sass}'],
				tasks: ['clean:css','sass:dev','jshint','requirejs:dev','includereplace:dev']
			},
			sass: {
				files: ['sass/**/*.{scss,sass}','!sass/fold-line.{scss,sass}'],
				tasks: ['clean:css','sass:dev']
			},
			js: {
				files: ['js/config.js','js/lib/**/*.js','js/src/**/*.js'],
				tasks: ['clean:js','jshint','requirejs:dev']
			},
			views: {
				files: ['views/**/*.view'],
				tasks: ['clean:markup','includereplace:dev']
			}
		},

		clean: {
			markup: ['build/index.html'],
			css: ['build/css/styles.css*','build/css/fold-line.css*'],
			js: ['build/js/script.js*']
		},

		jshint: {
			files: ['Gruntfile.js','js/config.js','js/src/**/*.js'],
			options: {
				curly: true,
				eqeqeq: true,
				forin: false,
				freeze: true,
				immed: true,
				indent: 4,
				latedef: true,
				noarg: true,
				nonbsp: true,
				plusplus: false,
				undef: true,
				unused: true,
				trailing: true,
				maxparams: 4,
				eqnull: true,
				browser: true,
				devel: false,
				phantom: true,
				sub: true,

				globals: {
					// AMD
					module:     true,
					require:    true,
					define:     true,

					// Environments
					console:    true
				}
			}
		},

		sass: {
			options: {
				imagePath: '/images/',
				sourceMap: true
			},
			prod: {
				options: { outputStyle: 'compressed' },
				files: {
					'build/css/styles.css': 'sass/styles.scss',
					'build/css/fold-line.css': 'sass/fold-line.scss'
				}
			},
			dev: {
				files: {
					'build/css/styles.css': 'sass/styles.scss',
					'build/css/fold-line.css': 'sass/fold-line.scss'
				}
			}
		},

		requirejs: {
			prod: {
				options: {
					baseUrl: '.',
					mainConfigFile: 'js/config.js',
					include: ['js/config'],
					name: 'js/almond.js',
					out: 'build/js/script.js',
					optimize : 'uglify2',
					preserveLicenseComments: false,
					generateSourceMaps : false,

					uglify2: {
						warnings: true,
						mangle: false
					}
				}
			},
			dev: {
				options: {
					baseUrl: '.',
					mainConfigFile: 'js/config.js',
					include: ['js/config'],
					name: 'js/almond.js',
					out: 'build/js/script.js',
					optimize : 'uglify2',
					preserveLicenseComments: false,
					generateSourceMaps : true,

					uglify2: {
						warnings: true,
						mangle: false
					}
				}
			}
		},

		includereplace: {
			prod: {
				options: {
					globals: {
						title: 'Union UPnP Configuration',
						description: 'please configure your website'
					}
				},
				src: 'views/main.view',
				dest: 'index.html'
			},
			dev: {
				options: {
					globals: {
						title: 'Union UPnP Configuration',
						description: 'please configure your website'
					}
				},
				src: 'views/main.view',
				dest: 'build/index.html'
			}
		},

		nodewebkit: {
			options: {
				appName: '<%= pkg.name %>',
				appVersion: '<%= pkg.version %>',
				platforms: ['win','osx','linux64'],
				buildDir: './dist', // Where the build version of my node-webkit app is saved
			},
			src: ['./build/**/*'] // Your node-webkit app
		}
	});

	// Default Task
	grunt.registerTask('default', ['watch']);

	// Release Tasks
	grunt.registerTask('build', [
		'clean',
		'sass:dev',
		'jshint',
		'requirejs:dev',
		'includereplace:dev',
		'nodewebkit'
	]);
};