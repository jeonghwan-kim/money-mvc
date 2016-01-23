/**
 * Created by Chris on 2016. 1. 23..
 */

'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('../models');

function setup() {
  passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      }, function (email, password, done) {
        models.User.findOne({
          where: {
            email: email,
            password: password
          }
        }).then(function (result) {
          if (!result) {
            return done(null, false);
          }
          return done(null, result.get({plain: true}));
        }).catch(function (err) {
          return done(err);
        })
      }
  ));
}

module.exports = {
  setup: setup
};
