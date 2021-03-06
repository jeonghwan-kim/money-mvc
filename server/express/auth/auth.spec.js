/**
 * Created by Chris on 2016. 1. 23..
 */

var should = require('should');
var crypto = require('crypto');
var request = require('supertest');
var models = require('../models');
var app = require('../app').app;


describe('POST /auth', function () {
  var user;

  before('Init database', function (done) {
    models.sequelize.sync({force: true}).then(function () {
      done();
    });
  });

  before('Create a user', function (done) {
    models.User.create({
      email: 'account1@gmail.com',
      password: '123456',
      name: 'user 1'
    }).then(function (result) {
      user = result.get({plain: true});
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  after('Destroy a user', function (done) {
    models.User.destroy({
      where: {id: user.id}
    }).then(function () {
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  it('should login success', function (done) {
    request(app)
        .post('/auth')
        .send({
          email: user.email,
          password: '123456'
        })
        .expect(200)
        .end(function (err, res) {
          if (err)throw new Error(err);
          res.body.should.have.property('accessToken');
          res.body.should.have.property('user');
          res.body.user.should.have.property('id');
          done();
        });
  });
});
