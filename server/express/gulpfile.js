/**
 * Created by Chris on 2016. 1. 26..
 */

var gulp = require('gulp');
var mocha = require('gulp-mocha');

process.env.NODE_ENV = 'test';

gulp.task('test', function () {
  gulp.src(['./api/**/*.spec.js', './auth/**/*.spec.js'])
      .pipe(mocha({
        reporter: 'dot',
        clearRequireCache: true,
        ignoreLeaks: true
      }));
});

gulp.task('default', ['test']);