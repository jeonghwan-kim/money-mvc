/**
 * Created by Chris on 2016. 1. 21..
 */

'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Expense)
      }
    }
  });

  return User;
};