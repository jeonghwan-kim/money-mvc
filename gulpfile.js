/**
 * Created by Chris on 2016. 1. 20..
 */

'use strict';

var gulp = require('gulp'),
    ip = '127.0.0.1',
    port = 9000,
    server;

server = {
  express:  require('./server/express')
};

gulp.task('serve:express', function (cb) {
  server.express.app.listen(port, ip, function () {
    console.log('Express server is running on %s:%d', ip, port);
    cb();
  });
});

gulp.task('serve:express:angular', ['serve:express'], function (cb) {
  server.express.setStatic('angular');
  cb();
});
