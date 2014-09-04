var markdown = require('node-markdown').Markdown;
module.exports = function(grunt) {
    grunt.initConfig({
    	  ngversion: '1.2.21',
        bsversion: '3.2.0',
        pkg: grunt.file.readJSON('package.json'),
        modules: [],	
        dist: 'dist',
        filename: 'ui-bootstrap-grid',
        meta: {
            modules: 'angular.module("ui.bootstrap", [<%= srcModules %>]);',
            tplmodules: 'angular.module("ui.bootstrap.tpls", [<%= tplModules %>]);',
            all: 'angular.module("ui.bootstrap", ["ui.bootstrap.tpls", <%= srcModules %>]);',
            banner: ['/*',
                     ' * <%= pkg.name %>',
                     ' * <%= pkg.homepage %>\n',
                     ' * Version: <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
                     ' * License: <%= pkg.license %>',
                     ' */\n'].join('\n')
        },
        concat: {
            dist: {
                options: {
                  banner: '/*!\n * <%= pkg.name %> - JS for Debug\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n * https://github.com/hxkinggil/AngularBootStrap | Licence: MIT\n */\n'
                },
                src: [
                  //'src/grid/directive/grid.js','src/grid/**/*.js','src/paging/**/*.js','template/grid/**/*.js','template/paging/**/*.js'
                ],
                dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js'
            },
            dist_tpls: {
                options: {
                    banner: '<%= meta.banner %><%= meta.all %>\n<%= meta.tplmodules %>\n'
                },
                src: [], //src filled in by build task
                dest: '<%= dist %>/<%= filename %>-tpls-<%= pkg.version %>.js'
            }
        },
        uglify: {
           
            options: {
                banner: '/*!\n * <%= pkg.name %> - compressed JS\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n * https://github.com/hxkinggil/AngularBootStrap | Licence: MIT\n */\n'
            },
            dist: {
            		 src:[
            		 	'<%= concat.dist.dest %>'
            		 ],
            		 dest:'<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js'
                 
            },
            dist_tpls:{
                src:['<%= concat.dist_tpls.dest %>'],
                dest:'<%= dist %>/<%= filename %>-tpls-<%= pkg.version %>.min.js'
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
				jshint: {
				  // define the files to lint
				  files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
				  // configure JSHint (documented at http://www.jshint.com/docs/)
				  options: {
				      // more options here if you want to override JSHint defaults
				    globals: {
				      jQuery: true,
				      console: true,
				      module: true
				    }
				  }
				}
        
    });
 		
 		grunt.loadNpmTasks('grunt-contrib-watch');
 		grunt.loadNpmTasks('grunt-html2js');
 	  grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
 
    grunt.registerTask('default', ['html2js','build']);
    
    
    
       //Common ui.bootstrap module containing all modules for src and templates
    //findModule: Adds a given module to config
    var foundModules = {};
    function findModule(name) {
        if (foundModules[name]) { return; }
        foundModules[name] = true;

        function breakup(text, separator) {
            return text.replace(/[A-Z]/g, function (match) {
                return separator + match;
            });
        }
        function ucwords(text) {
            return text.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
                return $1.toUpperCase();
            });
        }
        function enquote(str) {
            return '"' + str + '"';
        }

        var module = {
            name: name,
            moduleName: enquote('ui.bootstrap.' + name),
            displayName: ucwords(breakup(name, ' ')),
            srcFiles: grunt.file.expand('src/'+name+'/**/*.js'),
            tplFiles: grunt.file.expand('template/'+name+'/*.html'),
            tpljsFiles: grunt.file.expand('template/'+name+'/*.html.js'),
            tplModules: grunt.file.expand('template/'+name+'/*.html').map(enquote),
            dependencies: dependenciesForModule(name),
            docs: {
                md: grunt.file.expand('src/'+name+'/docs/*.md')
                    .map(grunt.file.read).map(markdown).join('\n'),
                js: grunt.file.expand('src/'+name+'/docs/*.js')
                    .map(grunt.file.read).join('\n'),
                html: grunt.file.expand('src/'+name+'/docs/*.html')
                    .map(grunt.file.read).join('\n')
            }
        };
        module.dependencies.forEach(findModule);
        grunt.config('modules', grunt.config('modules').concat(module));
    }

    function dependenciesForModule(name) {
        var deps = [];
        grunt.file.expand('src/' + name + '/**/*.js')
            .map(grunt.file.read)
            .forEach(function(contents) {
                //Strategy: find where module is declared,
                //and from there get everything inside the [] and split them by comma
                var moduleDeclIndex = contents.indexOf('angular.module(');
                var depArrayStart = contents.indexOf('[', moduleDeclIndex);
                var depArrayEnd = contents.indexOf(']', depArrayStart);
                var dependencies = contents.substring(depArrayStart + 1, depArrayEnd);
                dependencies.split(',').forEach(function(dep) {
                    if (dep.indexOf('ui.bootstrap.') > -1) {
                        var depName = dep.trim().replace('ui.bootstrap.','').replace(/['"]/g,'');
                        if (deps.indexOf(depName) < 0) {
                            deps.push(depName);
                            //Get dependencies for this new dependency
                            deps = deps.concat(dependenciesForModule(depName));
                        }
                    }
                });
            });
        return deps;
    }
    
   grunt.registerTask('build', 'Create bootstrap build files', function() {
        var _ = grunt.util._;

        //If arguments define what modules to build, build those. Else, everything
        if (this.args.length) {
            this.args.forEach(findModule);
            grunt.config('filename', grunt.config('filenamecustom'));
        } else {
            grunt.file.expand({
                filter: 'isDirectory', cwd: '.'
            }, 'src/*').forEach(function(dir) {
                findModule(dir.split('/')[1]);
            });
        }

        var modules = grunt.config('modules');
        grunt.config('srcModules', _.pluck(modules, 'moduleName'));
        grunt.config('tplModules', _.pluck(modules, 'tplModules').filter(function(tpls) { return tpls.length > 0;} ));
     

        var srcFiles = _.pluck(modules, 'srcFiles');
        var tpljsFiles = _.pluck(modules, 'tpljsFiles');
        //Set the concat task to concatenate the given src modules
        grunt.config('concat.dist.src', grunt.config('concat.dist.src')
            .concat(srcFiles));
        //Set the concat-with-templates task to concat the given src & tpl modules
        grunt.config('concat.dist_tpls.src', grunt.config('concat.dist_tpls.src')
            .concat(srcFiles).concat(tpljsFiles));
            
        //console.log(srcFiles);
            

        grunt.task.run(['concat', 'uglify']);
    });
    
    
};