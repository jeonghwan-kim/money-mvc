/**
 * Created by Chris on 2016. 1. 23..
 */


'use strict';

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var secret = 'money-mvc-s3cret';
var expireSeconds = 60 * 60; // 1 hour
var validateJwt = expressJwt({secret: secret});


function signToken(user) {
  return jwt.sign(user, secret, {expiresIn: expireSeconds});
}

module.exports = {
  signToken: signToken
};
