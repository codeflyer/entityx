module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-istanbul')

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc : '.jshintrc',
        force : true
      },
      all: ['Gruntfile.js', 'lib/**/*.js', 'tests/**/*.js']
    },
    jscs: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'tests/**/*.js'],
      options: {
        config: '.jscsrc'
      }
    },
    plato: {
      options: {
        jshint:  grunt.file.readJSON('.jshintrc')
      },
      main: {
        files: {
          'reports/plato/': ['lib/**/*.js', 'test/**/*.js']
        }
      }
    },
    watch: {
      files: ['<%= jscs.files %>'],
      tasks: ['jscs', 'jshint']
    },
    /*jshint camelcase: false */
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    mocha_istanbul: {
      coveralls: {
        src: ['tests/**/*.js'], // multiple folders also works
        options: {
          coverage:true,
          check: {
            lines: 75,
            statements: 75
          },
          root: './lib',
          reportFormats: ['cobertura','lcovonly', 'html']
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'jscs']);
}
;
