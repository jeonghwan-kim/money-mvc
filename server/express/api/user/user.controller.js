/**
 * Created by Chris on 2016. 1. 21..
 */

var models = require('../../models');

function create(req, res) {
  if (req.body.password && req.body.password.length < 6) {
    return res.status(400).json({'warn': 'password should be longer than 5 characters'});
  }

  models.User.create({
    email: req.body.email,
    password: req.body.password
  }).then(function (result) {
    res.status(201).json(result);
  }).catch(function (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({warn: 'Duplicated email address'})
    }
    throw new Error(err);
  });
}

function me(req, res) {
  res.json(req.user);
}

module.exports = {
  create: create,
  me: me
};
