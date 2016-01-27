/**
 * Created by Chris on 2016. 1. 21..
 */

'use strict';

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      },
      set: function (val) {
        this.setDataValue('password', crypto.createHash('md5').update(val).digest('hex'))
      },
      get: function () {
        return null;
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Expense)
      }
    }
  });

  return User;
};