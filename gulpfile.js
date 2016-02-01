/**
 * Created by Chris on 2016. 1. 20..
 */

'use strict';

var gulp = require('gulp');
var server;

server = {};

gulp.task('serve:express', function () {
  server.express = require('./server/express/app');
});

gulp.task('serve:express:angular', ['serve:express'], function () {
  server.express.setStatic('angular');
});
