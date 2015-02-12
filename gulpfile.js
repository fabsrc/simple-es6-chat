'use strict';

var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  traceur = require('gulp-traceur-compiler'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  jasmine = require('gulp-jasmine-phantom'),
  docco = require('gulp-docco'),
  es6moduletranspiler = require('gulp-es6-module-transpiler'),
  es6transpiler = require('gulp-es6-transpiler'),
  to5 = require('gulp-6to5'),
  jasminePhantomJs = require('gulp-jasmine2-phantomjs'),
  nodemon = require('gulp-nodemon'),
  karma = require('gulp-karma');


///////////////////////////////////////
//
//  Set configs here
//
///////////////////////////////////////

var config = {
  source: {
    js: './src/js/**/*.js',
    scss: './src/scss/**/*.scss',
    test: './src/test/**/*.js'
  },
  dest: {
    js: './js',
    css: './css',
    doc: './doc'
  }
};


///////////////////////////////////////
//
//  ALL the tasks
//
///////////////////////////////////////

gulp.task('default', ['build:js', 'build:css', 'serve']);

gulp.task('serve', ['nodeserver'], function() {
  browserSync({
    port: 5555,
    proxy: 'localhost:3000',
    ui: {
      port: 5556
    }
  });
  gulp.watch([config.source.js], ['build:js', browserSync.reload]);
  gulp.watch([config.source.scss], ['build:css', browserSync.reload]);
  gulp.watch('*.html', browserSync.reload);
});

gulp.task('nodeserver', function(cb) {
  var called = false;
  return nodemon({
    script: 'server.js',
    ignore: [
      'gulpfile.js',
      'node_modules/',
      'js/',
      'doc/',
      'bower_components/',
      'css/',
      'src/'
    ]
  }).on('start', function() {
    if (!called) {
      called = true;
      cb();
    }
  });
});

gulp.task('build:js', function() {
  return gulp.src(config.source.js)
    .pipe(traceur({
      'modules': 'instantiate'
    }))
    .pipe(uglify())
    .pipe(gulp.dest(config.dest.js));
});

gulp.task('build:css', function() {
  return gulp.src(config.source.scss)
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(minifycss())
    .pipe(gulp.dest(config.dest.css));

});

gulp.task('test', function() {
  gulp.src(config.source.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
  // gulp.src([config.dest.js + '/*.js', config.source.test])
  //   .pipe(karma({
  //     configFile: 'karma.conf.js',
  //     action: 'run'
  //   }));
  gulp.src([
    'bower_components/underscore/underscore.js',
    'bower_components/backbone/backbone.js',
    'bower_components/traceur-runtime/traceur-runtime.js',
    'bower_components/es6-module-loader/dist/es6-module-loader.js',
    'bower_components/system.js/dist/system.js',
    config.dest.js+'**/*.js',
    config.source.test
    ]).pipe(jasmine());
});

gulp.task('doc', function() {
  return gulp.src(config.source.js)
    .pipe(docco())
    .pipe(gulp.dest(config.dest.doc));
});
