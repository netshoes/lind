var CONFIG = require ('./config.js');

module.exports = function(grunt) {
  
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  
  grunt.initConfig({
    
    // Project paths
    paths: {
      js: 'src/js/',
      src: 'src/',
      dist: 'dist/'
    },
    
    // Watch
    watch: {
      options: {
        nospawn: true
      },
      
      js: {
        files: ['<%= paths.src %>**/*.js'],
        tasks: ['jshint', 'concat']
      }
    },
    
    // Ftp
		ftp_push: {
			staging: {
				options: {
					authKey: CONFIG.ftp_push_config.staging.authKey,
          host: CONFIG.ftp_push_config.staging.host,
					dest: CONFIG.ftp_push_config.staging.dest,
					port: CONFIG.ftp_push_config.staging.port,
					incrementalUpdates: false
				},
				files: [
        {
          expand: true,
          cwd: 'dist/',
          src: ['*.js'],
          dest: '/'+grunt.option('project')+"/"
        },
        {
          expand: true,
          cwd: 'src/js/tmp/',
          src: ['*.json'],
          dest: '/'+grunt.option('project')+"/"
        }
				]
      },
			prod: {
				options: {
					authKey: CONFIG.ftp_push_config.production.authKey,
          host: CONFIG.ftp_push_config.production.host,
					dest: CONFIG.ftp_push_config.production.dest,
					port: CONFIG.ftp_push_config.production.port,
					incrementalUpdates: false
				},
				files: [
        {
          expand: true,
          cwd: 'dist/',
          src: ['*.js'],
          dest: '/'+grunt.option('project')+"/"
        }
				]
			}
		},
    
    // Concat
    concat: {
      core: {
        src: [
        'src/js/core/config.js',
        'src/js/core/rules.js',
        'src/js/core/sort.js',
        'src/js/core/filter.js',
        'src/js/core/filter.js',
        'src/js/core/cookie.js',
        'src/js/helpers/**/*.js',
        'src/js/core/core.js'
        ],
        dest: 'src/js/lind.js'
      },
      desktop: {
        options: {
          sourceMap: true
        },
        src: [
        'src/js/core/config_desktop.js',
        'src/js/tests/' + grunt.option('project') + '/desktop/**/*.js',
        'src/js/lind.js',
        ],
        dest: 'dist/lindd.js',
      },
      mobile: {
        options: {
          sourceMap: true
        },
        src: [
          'src/js/core/config_mobile.js',
        'src/js/tests/' + grunt.option('project') + '/mobile/**/*.js', 
        'src/js/lind.js',
        ],
        dest: 'dist/lindm.js',
      }
    },
    
    // Uglify    
    uglify: {
      build: {
        options: {
          report: "gzip",
          wrap: "lind",
          preserveComments: false,
        },
        files: {
          'dist/lindm.min.js': [
          'src/js/tests/' + grunt.option('project') + '/mobile/**/*.js',
          'src/js/core/config.js',
          'src/js/core/config_mobile.js',
          'src/js/core/rules.js',
          'src/js/core/sort.js',
          'src/js/core/filter.js',
          'src/js/core/filter.js',
          'src/js/core/cookie.js',
          'src/js/helpers/**/*.js',
          'src/js/core/core.js'
          ],
          'dist/lindd.min.js': [
          'src/js/tests/' + grunt.option('project') + '/desktop/**/*.js', 
          'src/js/core/config.js',
          'src/js/core/config_desktop.js',
          'src/js/core/rules.js',
          'src/js/core/sort.js',
          'src/js/core/filter.js',
          'src/js/core/filter.js',
          'src/js/core/cookie.js',
          'src/js/helpers/**/*.js',
          'src/js/core/core.js'
          ]
        },
      }
    },

    // Server
    connect: {
      uses_defaults: {}
    },
    
		// JsHint
		jshint: {
			all:[
      'src/js/core/**/*.js',
      'src/js/tests/**/*.js'
			]
		},
    
    // JsHint Config
    jshintConfig: {
      esversion: 5
    },
    
    // Clean
    clean: {
      options: {
        'force': true
      },
      core: ['src/js/lind.js'],
      build: ['<%= paths.dist %>']
    },
    
		// Nofity
		notify: {
			msg1: {
				options: {
					title: 'Preparing Environment',
					message: 'Wait...'
				}
			},
			msg2: {
				options: {
					title: 'Preparing Environment',
					message: 'Done.'
				}
			},
			msg3: {
				options: {
					title: 'Preparing Build',
					message: 'Wait...'
				}
			},
			msg4: {
				options: {
					title: 'Preparing Build',
					message: 'Done.'
				}
			},
			msg5: {
				options: {
					title: 'Upload files',
					message: 'Done.'
				}
			}
		}
	});

  // Check parameters
  grunt.registerTask("checkParameters"," Check if all parameters are passed",function(){
    if(grunt.option('project') == null) {
      grunt.warn("Parameter project required. Use --project=NAMEPROJECT for run the project.");
    }
  });

  // Dev tasks
  grunt.registerTask('core', [
  'concat:core'
  ]);

  grunt.registerTask('desktop', [
  'checkParameters',
  'notify:msg1',
  'clean:build',
  'concat:desktop',
  'notify:msg2',
  'connect',
  'watch'
	]);
  
	// Mobile
	grunt.registerTask('mobile', [
  'checkParameters',
  'notify:msg1',
  'clean:build',
  'concat:core',
  'concat:mobile',
  'notify:msg2',
  'connect',
  'watch'
	]);

  // Build tasks
  grunt.registerTask('build',[
  'checkParameters',
  'notify:msg1',
  'clean',
  'jshint',
  'concat:core',
  'uglify',
  'notify:msg4'
  ]);

  grunt.registerTask('build:prod',[
  'checkParameters',
  'notify:msg1',
  'clean',
  'jshint',
  'concat:core',
  'uglify',
  'ftp:prod',
  'notify:msg4'
  ]);

  grunt.registerTask('build:staging',[
  'checkParameters',
  'notify:msg1',
  'clean',
  'jshint',
  'concat:core',
  'uglify',
  'ftp:staging',
  'notify:msg4'
  ]);

  // FTP's
	grunt.registerTask('ftp:staging', [
  'ftp_push:staging',
  'notify:msg5',
	]);
  
	grunt.registerTask('ftp:prod', [
  'ftp_push:prod',
  'notify:msg5',
	]);
};