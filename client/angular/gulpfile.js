/**
 * Created by Chris on 2016. 2. 1..
 */

var gulp = require('gulp'),
//del = require('del'),
    browserSync = require('browser-sync');


gulp.task('serve', function () {
  browserSync.init({
    proxy: 'localhost:3000'
  });

  gulp.watch(['app/**/*', 'index.html']).on('change', browserSync.reload);
});
