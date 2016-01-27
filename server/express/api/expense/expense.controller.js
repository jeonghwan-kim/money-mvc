/**
 * Created by Chris on 2016. 1. 21..
 */

'use strict';

var models = require('../../models');

function index(req, res) {
  models.Expense.findAll({
    where: {
      UserId: req.user.id
    }
  }).then(function (expenses) {
    res.json(expenses);
  }).catch(function (err) {
    res.status(500).json({error: err});
  });
}

function show(req, res) {
  models.Expense.findOne({
    where: {
      id: req.params.id
    }
  }).then(function (expense) {
    res.json(expense);
  }).catch(function (err) {
    res.status(500).json({error: err});
  });
}

module.exports = {
  index: index,
  show: show
};
