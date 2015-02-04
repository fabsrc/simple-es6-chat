'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    traceur = require('gulp-traceur'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    jasmine = require('gulp-jasmine'),
    docco = require('gulp-docco');


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
    js:'./js',
    css:'./css',
    doc: './doc'
  }
};


///////////////////////////////////////
//
//  ALL the tasks
//
///////////////////////////////////////

gulp.task('default', ['build:js', 'build:css', 'serve']);

gulp.task('serve', function() {
  browserSync({
    server: {
        baseDir: './'
    }
  });
  gulp.watch([config.source.js], ['build:js', browserSync.reload]);
  gulp.watch([config.source.scss], ['build:css', browserSync.reload]);
  gulp.watch('*.html', browserSync.reload);
});

gulp.task('build:js', function() {
  return gulp.src(config.source.js)
         //.pipe(traceur())
         //.pipe(uglify())
         .pipe(gulp.dest(config.dest.js));
});

gulp.task('build:css', function() {
  return gulp.src(config.source.scss)
         .pipe(sass())
         .pipe(autoprefixer())
         .pipe(minifycss())
         .pipe(gulp.dest(config.dest.css));

});

gulp.task('test', function() {
  gulp.src(config.source.js)
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'));
  gulp.src(config.source.test)
      .pipe(jasmine());
});

gulp.task('doc', function() {
  return gulp.src(config.source.js)
      .pipe(docco())
      .pipe(gulp.dest(config.dest.doc));
});

gulp.task('clean:js', function() {

});
