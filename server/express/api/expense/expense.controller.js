/**
 * Created by Chris on 2016. 1. 21..
 */

'use strict';

var _ = require('lodash');
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

function update(req, res) {
  var values = _.omitBy({
    amount: req.body.amount,
    date: req.body.date,
    memo: req.body.memo
  }, _.isUndefined);

  if (_.isEmpty(values)) {
    return res.status(400).json({warn: 'body is empty'});
  }

  models.Expense.findOne({
    where: {
      id: req.params.id
    }
  }).then(function (expense) {
    if (!expense) {
      return res.status(404).json();
    }
    expense.updateAttributes(values).then(function (expense) {
      res.json(expense);
    }).catch(function (err) {
      res.status(500).json({error: err})
    });
  });
}

function destroy(req, res) {
  models.Expense.destroy({
    where: {
      id: parseInt(req.params.id, 10)
    }
  }).then(function (affectedRows) {
    if (!affectedRows) {
      return res.status(404).json({warn: 'No expense'});
    }
    res.status(204).json();
  }).catch(function (err) {
    res.status(500).json({error: err})
  })
}

module.exports = {
  index: index,
  show: show,
  update: update,
  destroy: destroy
};
