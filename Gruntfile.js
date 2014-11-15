module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-plato');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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

  grunt.registerTask('default', ['jscs']);
};
