/**
 * Created by Chris on 2016. 2. 1..
 */

var gulp = require('gulp'),
    del = require('del');


gulp.task('copy', ['clean'], function () {
  gulp.src('./index.html')
      .pipe(gulp.dest('./dist/'));

  gulp.src('./js/**/*.js')
      .pipe(gulp.dest('./dist/js'));
});

gulp.task('clean', del.bind(null, ['./dist']));

gulp.task('build', ['copy']);

gulp.task('default', ['build']);
