module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  var jshintOptions = {
    camelcase : true,
    curly : true,
    eqeqeq : true,
    forin : true,
    newcap : true,
    nonbsp : true,
    unused : 'vars',
    eqnull : true,
    node : true,
    devel : true,
    expr : true
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options : jshintOptions,
      all: ['Gruntfile.js', 'lib/**/*.js', 'tests/**/*.js']
    },
    jscs: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'tests/**/*.js'],
      options: {
        config: '.jscsrc'
      }
    },
    plato: {
      main: {
        files: {
          'reports/plato/': ['lib/**/*.js', 'test/**/*.js']
        }
      }
    },
    watch: {
      files: ['<%= jscs.files %>'],
      tasks: ['jscs']
    }
  });

  grunt.registerTask('default', ['jshint', 'jscs']);
};