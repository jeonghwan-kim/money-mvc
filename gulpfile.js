/**
 * Created by Chris on 2016. 1. 20..
 */

'use strict';

var gulp = require('gulp'),
    server;

server = {
  express:  require('./server/express')
};

gulp.task('serve:express', function (cb) {
  server.express.run(cb)
});

gulp.task('serve:express:angular', ['serve:express'], function (cb) {
  server.express.setStatic('angular');
  cb();
});
