'use strict';
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('load-grunt-tasks')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist',
    host: require('./bower.json').host,
    port: require('./bower.json').port,
    live: require('./bower.json').live,
    jserver: require('./bower.json').jserver
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    kill: appConfig,

    // Git connection
    buildcontrol: {
			options: {
				'dir': 'release',
				commit: true,
				push: true,
				message: 'Built by rykn0wxx'
			},
			pages: {
				options: {
					remote: 'https://github.com/rykn0wxx/kpi-dashboard.git',
					branch: 'gh-pages'
				}
			}
		}


  });

  grunt.registerTask('metallica', 'Preparing to end this start', function methodName () {

    grunt.task.run([
      'clean:server',
  		'wiredep',
  		'less',
  		'concurrent:server',
  		'postcss:server',
  		'connect:livereload',
  		//'browserSync',
      //'concurrent:jsonwatch'
  		'watch'
    ]);

  });

  grunt.loadNpmTasks('grunt-build-control');

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
		'copy:data',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('deploy', [
    'newer:jshint',
    'newer:jscs',
    'build',
		'copy:data',
		'buildcontrol'
  ]);



};
