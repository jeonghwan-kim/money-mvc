/**
 * Created by Chris on 2016. 1. 26..
 */

var gulp = require('gulp');
var mocha = require('gulp-mocha');

process.env.NODE_ENV = 'test';

gulp.task('test', function () {
  gulp.src(['./api/**/*.spec.js', './auth/**/*.spec.js'])
      .pipe(mocha({
        reporter: 'spec',
        clearRequireCache: true,
        ignoreLeaks: true
      }));
});

gulp.task('watch', function () {
  gulp.watch(['./api/**/*.js', './auth/**/*.js'], ['test']);
});

gulp.task('default', ['test', 'watch']);