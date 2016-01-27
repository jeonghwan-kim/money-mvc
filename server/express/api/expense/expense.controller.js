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

module.exports = {
  index: index
};
