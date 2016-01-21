/**
 * Created by Chris on 2016. 1. 21..
 */

'use strict';

var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Expense = sequelize.define('Expense', {
    date: {
      type: DataTypes.DATEONLY,
      get: function () {
        try {
          return moment(this.getDataValue('date')).format('YYYY-MM-DD');
        } catch (e) {
          return null;
        }
      },
      set: function (val) {
        try {
          this.setDataValue('date', moment(val, 'YYYY-MM-DD').format('YYYY-MM-DD'));
        } catch(e) {
          this.setDataValue('date', null);
        }
      }
    },
    memo: DataTypes.STRING,
    amount: DataTypes.BIGINT.UNSIGNED
  }, {
    classMethods: {
      associate: function(models) {
        Expense.belongsTo(models.User, {
          onDelete: 'CASCADE'
        })
      }
    }
  });

  return Expense;
};