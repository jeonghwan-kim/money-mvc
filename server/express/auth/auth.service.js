/**
 * Created by Chris on 2016. 1. 23..
 */


'use strict';

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var secret = 'money-mvc-s3cret';
var expireSeconds = 60 * 60; // 1 hour
var validateJwt = expressJwt({secret: secret});
var models = require('../models');


function signToken(user) {
  return jwt.sign(user, secret, {expiresIn: expireSeconds});
}

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 401
 */
function isAuthenticated() {
  return compose()
      .use(function (req, res, next) {
        // allow accessToken to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('accessToken')) {
          req.headers.authorization = 'Bearer ' + req.query.accessToken;
        }
        validateJwt(req, res, next);
      })
      .use(function (err, req, res, next) {
        // Check the token
        if (err.name === 'UnauthorizedError') {
          res.status(401).json({'error': 'invalid token'});
        }
      })
      .use(function (req, res, next) {
        // Attach user to request
        models.User.findOne({
          where: {
            id: req.user.id
          }
        }).then(function (user) {
          if (!user) {
            res.send(401);
          } else {
            req.user = user.get({plain: true});
            next();
          }
        }).catch(function (err) {
          next(err);
        });
      });
}

module.exports = {
  signToken: signToken,
  isAuthenticated: isAuthenticated
};
