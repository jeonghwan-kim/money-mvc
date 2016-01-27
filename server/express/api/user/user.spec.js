/**
 * Created by Chris on 2016. 1. 21..
 */

var should = require('should');
var crypto = require('crypto');
var request = require('supertest');
var models = require('../../models');
var app = require('../../app').app;

describe('POST /api/users', function () {
  var users = [];

  before('Init database', function (done) {
    models.sequelize.sync({force: true}).then(function () {
      done();
    });
  });

  before('Create a user', function (done) {
    models.User.create({
      email: 'account0@mail.net',
      password: '123456'
    }).then(function (result) {
      users.push(result.get({plain: true}));
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  after('Destroy the user', function (done) {
    models.User.destroy({
      where: {
        id: {
          $in: users.reduce(function (result, item) {
            result.push(item.id);
            return result;
          }, [])
        }
      }
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
          users.push(res.body);
          res.body.should.have.property('id');
          res.body.should.have.property('email', 'account1@mail.net');
          res.body.should.have.property('password', null);
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

  it('should return 409 on duplicated email', function (done) {
    request(app)
        .post('/api/users')
        .send({
          email: users[0].email,
          password: '123456'
        })
        .expect(409)
        .end(done);
  });
});

describe('GET /api/users/me', function () {
  var user,
      accessToken;

  before('Create user and login', function (done) {
    models.User.create({
      email: 'account@mail.net',
      password: '123456'
    }).then(function (result) {
      user = result.get({plain: true});
      request(app)
          .post('/auth')
          .send({
            email: 'account@mail.net',
            password: '123456'
          })
          .expect(200)
          .end(function (err, res) {
            if (err) throw new Error(err);
            accessToken = res.body.accessToken;
            done();
          });
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  after('Destory the user', function (done) {
    user = user || {id: 0};
    models.User.destroy({
      where: {id: user.id}
    }).then(function () {
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  it('should return user object', function (done) {
    request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)
        .end(function (err, res) {
          if (err) throw new Error(err);
          res.body.should.have.property('id', user.id);
          res.body.should.have.property('email', user.email);
          res.body.should.have.property('password', null);
          done();
        });
  });
});
