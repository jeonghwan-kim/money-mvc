/**
 * Created by Chris on 2016. 1. 21..
 */

'use strict';

var path = require('path');

module.exports = function (app) {
  app.use('/api/echo', require('./api/echo'));
  app.use('/api/expenses', require('./api/expense'));
};