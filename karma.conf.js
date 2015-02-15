module.exports = function(config) {
  'use strict';

  config.set({

    basePath: './',

    frameworks: ['jasmine-jquery', 'jasmine', 'systemjs'],

    files: [
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/underscore/underscore.js',
      'bower_components/backbone/backbone.js',
      'src/test/fixtures.html'
    ],

    systemjs: {
      config: {
        baseURL: './'
      },
      files: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/underscore/underscore.js',
        'bower_components/backbone/backbone.js',
        'src/js/**/*.js',
        'src/test/**/*.js'
      ]
    },

    preprocessors: {
      '**/*.html': ['html2js']
    },

    reporters: ['progress'],

    colors: true,

    logLevel: config.LOG_ERROR,

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: true
  });
};
