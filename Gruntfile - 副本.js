var markdown = require('node-markdown').Markdown;
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        modules: [],	
        dist: 'dist',
        filename: 'ui-bootstrap-grid',
        concat: {
            dist: {
                options: {
                  banner: '/*!\n * <%= pkg.name %> - JS for Debug\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n * https://github.com/hxkinggil/AngularBootStrap | Licence: MIT\n */\n'
                },
                src: [
                  'src/grid/directive/grid.js','src/grid/**/*.js','src/paging/**/*.js','template/grid/**/*.js','template/paging/**/*.js'
                ],
                dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js'
            }
        },
        uglify: {
           
            options: {
                banner: '/*!\n * <%= pkg.name %> - compressed JS\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n * https://github.com/hxkinggil/AngularBootStrap | Licence: MIT\n */\n'
            },
            dist: {
            		 //src:[
            		// 	'<%= concat.dist.dest %>'
            		// ],
            		 files: {
			        		'<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js':['<%= concat.dist.dest %>']
			        	}
                 //dest:'<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js'
            }

            
        },
         html2js: {
					dist: {
							options: {
								module: null, // no bundle module for all the html2js templates
								base: '.'
							},
							files: [{
								expand: true,
								src: ['template/grid/**/*.html','template/paging/**/*.html'],
								ext: '.html.js'
							}]
					}
				},
        
    });
 		
 		grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
 
    grunt.registerTask('default', ['html2js','concat', 'uglify']);
    
   
    
    
};