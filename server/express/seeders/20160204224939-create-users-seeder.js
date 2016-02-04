'use strict';

var crypto = require('crypto');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      email: 'user0@mail.com',
      password: crypto.createHash('md5').update('123456').digest('hex')
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', {
      email: {
        $in: ['user0@mail.com']
      }
    }, {});
  }
};
