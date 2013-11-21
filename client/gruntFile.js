module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['clean','concat','stylus:build']);
  grunt.registerTask('release', ['clean','uglify','stylus:min','concat:index']);

  grunt.initConfig({
    distdir: 'dist',
    staticdir: '.',
    //staticdir: '/static',
    pkg: grunt.file.readJSON('package.json'),
    banner:
      '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
      ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
      src: {
      js: ['src/**/*.js'],
      stylus: ['src/stylus/stylesheet.styl']
    },
    clean: ['<%= distdir %>/*'],
    concat:{
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: { process: true }
      },
      angular: {
        src:['vendor/angular/angular.js', 'vendor/angular/angular-route.js'],
        dest: '<%= distdir %>/angular.js'
      },
      bootstrap: {
        src:['vendor/angular-ui/bootstrap/*.js'],
        dest: '<%= distdir %>/bootstrap.js'
      }
    },
    stylus: {
      build: {
        options: {
          compress: false
        },
        files: {
          '<%= distdir %>/<%= pkg.name %>.css':['<%= src.stylus %>']
        }
      },
      min: {
        options: {
          compress: true
        },
        files: {
          '<%= distdir %>/<%= pkg.name %>.css':['<%= src.stylus %>']
        }
      }
    },
    uglify: {
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>' ,'<%= src.js %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      angular: {
        src:['<%= concat.angular.src %>'],
        dest: '<%= distdir %>/angular.js'
      },
      bootstrap: {
        src:['vendor/angular-ui/bootstrap/*.js'],
        dest: '<%= distdir %>/bootstrap.js'
      },
    }
    });
  };
