/**
 * Created by Chris on 2016. 1. 23..
 */

var passport = require('passport');
var auth = require('./auth.service');

function login (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) {
      return res.status(401).json(error);
    }
    if (!user) {
      return res.status(404).json();
    }
    res.status(200).json({
      user: user,
      accessToken: auth.signToken(user)
    });
  })(req, res, next);
}

function logout (req, res) {
  res.status(204).send();

}

module.exports = {
  login: login,
  logout: logout
};
