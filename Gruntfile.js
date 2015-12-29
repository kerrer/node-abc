module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        all: [
          'Gruntfile.js',
          'src/**/*.js1'
        ]
    },
    clean: {
    	target:["target"],
    },
    test: {
            all: ['target/test/**/*_test.js']
    },
    jsdoc : {
        dist : {
            src: ['src/main/**/*.js', 'src/test/**/*.js'],
            options: {
                destination : 'target/out/doc',
                template : "node_modules/ink-docstrap/template",
                configure : "node_modules/grunt-build/jsdoc.conf.json"
            }
        }
    },
    compress: {
    	  main: {
    	    options: {
    	      archive: './target/<%= pkg.name %>-<%= pkg.version %>.zip'
    	    },
    	    files: [
    	      {expand: true, cwd: 'target/services', src: ['**'], dest: '<%= pkg.name %>/services/'}, 
    	      {expand: true, cwd: 'bin', src: ['**'], dest: '<%= pkg.name %>/bin/'}, 
    	      {expand: true, cwd: '.', src: ['package.json'], dest: '<%= pkg.name %>/', filter: 'isFile'},
    	    ]
    	  }
    },
    watch: {
            scripts: {
                files: ['src/**/*.js','src/**/*.json'],
                tasks: ['develop'],
                options: {
                     spawn: false,
                     interrupt: true,
                     debounceDelay: 500,
                },
            }
    },
    concurrent: {
            target: {
               tasks: ['nodemon', 'watch'],
               options: {
                   logConcurrentOutput: true
               }
            }
    },
    nodemon: {
            dev: {
                script: './bin/start',
                options: {
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                        nodemon.on('restart', function () {
                            console.log("restart ok");
                        });
                    },
                    cwd: __dirname,
                    watch: "target/services/*.*",
                    delay: 3000,
                    legacyWatch: true,
                }
            }
    },
    env : {
		options : {},
		dev : {
			NODE_ENV : 'development',
			DEST     : 'temp'
		},
		build : {
			NODE_ENV : 'production',
			DEST     : 'dist',
			concat   : {
				PATH     : {
					'value': 'node_modules/.bin',
					'delimiter': ':'
				}
			}
		}
	}
  });
 
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['develop']);
  grunt.registerTask('develop', ['env:dev','jshint','clean','build']);
  grunt.registerTask('product', ['env:build','jshint','clean','build','jsdoc','compress']);
  grunt.registerTask('ws', ['develop','nodemon', 'watch']); 
};
