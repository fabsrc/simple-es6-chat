module.exports = function(config) {
  'use strict';

  config.set({

    base: '.',

    frameworks: ['jasmine', 'systemjs'],
    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/underscore/underscore.js',
      'bower_components/backbone/backbone.js',
      'bower_components/traceur-runtime/traceur-runtime.js',
      'bower_components/es6-module-loader/dist/es6-module-loader.js',
      'bower_components/system.js/dist/system.js',
      'js/*.js',
      'src/test/*.js'
    ],

    reporters: ['progress'],
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-systemjs'
    ]
  });
};
