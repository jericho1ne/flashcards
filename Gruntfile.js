/**
 * @file Gruntfile.js 
 * @author Rebecca Choi
 * @copyright 2016 USC Architecture.  All rights reserved.
 */
'use strict';

module.exports = function (grunt) {
	// Time how long tasks take;  Optimizing build times!
	require('time-grunt')(grunt);

	// cfgurable paths
	var cfg = {
		src: 'src',
		dst: 'app'
	};

	// Define the cfguration for all the tasks
	grunt.initConfig({

		// Project settings
		cfg: cfg,
		scpConfig: grunt.file.readJSON('scp.json'),

		// Watches files for changes and runs tasks based on what's changed
		// watch: require('./grunt-include/watch'),

		// Cachebuster! - appends random alphanumeric string before file extension 
		//filerev: require('./grunt-include/filerev'),

		/**
		 * Uglify: minify js files
		 * Needs to happen after JS file get copied to dist
		 * https://github.com/gruntjs/grunt-contrib-uglify
		 */
		// uglify: {
		// 	options: {
		// 		preserveComments: false,
		// 		screwIE8: true,
		// 		mangle: false,
		// 		// cwd: '<%= cfg.src %>/scripts/vendor/'
		// 		// exceptionsFiles: [
		// 		// 	'datatables.min.js', 
		// 		// 	'jquery-2.2.0.min.js'
		// 		// ]
		// 	},
		// 	dist: {
		// 		files: [{
		// 			expand: true,
		// 			cwd: '<%= cfg.src %>/scripts/vendor/',
		// 			src: [ '*.js', '!datatables.min.js' ],
		// 			dest: '<%= cfg.dst %>/scripts/vendor',
		// 			ext:  '.min.js'
		// 		}]
		// 	}// End uglify:dist
		// },// End uglify task
	
		scp: {    
			options: {
				host: '<%= scpConfig.host %>',
				username: '<%= scpConfig.username %>',
				password: '<%= scpConfig.password %>'
			},
			your_target: {
				files: [{
					cwd: '<%= cfg.src %>',
					src: [
						'**/*.html', 
						'**/*.js', 
						'**/*.csv', 
						'**/*.css',
						//'images/_grey-bg.png',
						// 'images/*',
					],
					filter: 'isFile',
					// path on the server
					dest: '<%= scpConfig.directory %>'
				}]
			},
		}// End task grunt-scp

	});// End initConfit

	grunt.registerTask('default', [
		'build'
	]);// End register task :: default

	// This is the default Grunt task if you simply run "grunt" in project dir
	grunt.registerTask('build', [
		'scp'
		// 'uglify',
		// 'filerev:all',
		// 'usemin',
		// 'htmlmin'
	]);// End register task :: build

	// grunt.registerTask('pushtodev', ['build', 'ftpush:dev']);

	//
	// LOAD NPM TASKS
	//
	// npm install <TASK_NAME> --save-dev (if any are missing)
	grunt.loadNpmTasks('grunt-ssh');
	grunt.loadNpmTasks('grunt-scp');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-filerev');
	// grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-cssmin');
	// grunt.loadNpmTasks('grunt-contrib-htmlmin');
	// grunt.loadNpmTasks('grunt-usemin');
	// 
	// grunt.loadNpmTasks('grunt-sftp-deploy');	// bulk upload
};// End module.exports
