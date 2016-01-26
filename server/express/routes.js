/**
 * Created by Chris on 2016. 1. 21..
 */

'use strict';

function setup(app) {
  app.use('/api/echo', require('./api/echo'));
  app.use('/api/expenses', require('./api/expense'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
}

module.exports = {
  setup: setup
};
