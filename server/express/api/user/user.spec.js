/**
 * Created by Chris on 2016. 1. 21..
 */

var should = require('should');
var crypto = require('crypto');
var request = require('supertest');
var models = require('../../models');
var app = require('../../app').app;

describe('POST /api/users', function () {
  var user;

  after('Destroy the user', function (done) {
    user = user || {id: 0};
    models.User.destroy({
      where: {id: user.id}
    }).then(function () {
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  it('should create a user', function (done) {
    request(app)
        .post('/api/users')
        .send({
          email: 'account1@mail.net',
          password: '123456'
        })
        .expect(201)
        .end(function (err, res) {
          if (err) throw new Error(err);
          user = res.body;
          user.should.have.property('id');
          user.should.have.property('email', 'account1@mail.net');
          user.should.have.property('password', null);
          done();
        });
  });

  it('should return 400 on short password', function (done) {
    request(app)
        .post('/api/users')
        .send({
          email: 'account1@mail.net',
          password: '12345'
        })
        .expect(400)
        .end(function (err, res) {
          if (err) throw new Error(err);
          res.body.should.have.property('warn', 'password should be longer than 5 characters');
          done();
        });
  });
});
