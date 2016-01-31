/**
 * Created by Chris on 2016. 1. 21..
 */

'use strict';

var _ = require('lodash'),
    moment = require('moment'),
    models = require('../../models');

function meta(req, res) {
  var query = 'SELECT DISTINCT(LEFT(date, 7)) as date FROM Expenses where UserId = :UserId order by date desc',
      values = {UserId: req.user.id};
  models.sequelize.query(query, {replacements: values})
      .spread(function (results, metadata) {
        res.json({dates: _.map(results, 'date')});
      });
}

function index(req, res) {
  var date,
      cond = {};

  cond.UserId = req.user.id;

  if (req.query.date) {
    try {
      date = moment(req.query.date + '-01', 'YYYY-MM-DD');
      cond.date = {
        $between: [
          date.toDate().toISOString(),
          date.endOf('month').toDate().toISOString()
        ]
      };
    } catch (e) {
      date = null;
    }
  }

  if (req.query.search) {
    cond.memo = {
      like: '%' + req.query.search + '%'
    };
  }

  models.Expense.findAll({
    where: cond,
    offset: parseInt(req.query.skip, 10) || 0,
    limit: parseInt(req.query.limit, 10) || null
  }).then(function (expenses) {
    res.json(expenses);
  }).catch(function (err) {
    console.error(err);
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
  meta: meta,
  index: index,
  show: show,
  update: update,
  destroy: destroy
};
