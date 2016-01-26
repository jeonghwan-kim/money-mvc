/**
 * Created by Chris on 2016. 1. 23..
 */

'use strict';

var crypto = require('crypto');
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
            password: crypto.createHash('md5').update(password).digest('hex')
          }
        }).then(function (result) {
          if (!result) {
            done(null, false);
          } else {
            done(null, {id: result.get({plain: true}).id});
          }
        }).catch(function (err) {
          done(err);
        })
      }
  ));
}

module.exports = {
  setup: setup
};
