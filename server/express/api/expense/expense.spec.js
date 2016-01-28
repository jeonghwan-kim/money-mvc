/**
 * Created by Chris on 2016. 1. 21..
 */

var should = require('should');
var request = require('supertest');
var models = require('../../models');
var app = require('../../app').app;

describe('GET /api/expenses', function () {
  var user;
  var accessToken;
  var expense;

  before('Init database', function (done) {
    models.sequelize.sync({force: true}).then(function () {
      done();
    });
  });

  before('Create User and login', function (done) {
    models.User.create({
      email: 'account1@email.com',
      password: '123456'
    }).then(function (result) {
      user = result.get({plain: true});
      request(app)
          .post('/auth')
          .send({
            email: user.email,
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

  after('Destroy a user', function (done) {
    models.User.destroy({
      where: {
        id: user.id
      }
    }).then(function () {
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  before('Create a expense', function (done) {
    models.Expense.create({
      date: '2016-01-01',
      memo: 'memo 1',
      amount: 10000,
      UserId: user.id
    }).then(function (result) {
      expense = result.get({plain: true});
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  after('Remove the expense', function (done) {
    models.Expense.destroy({
      where: {
        id: expense.id
      }
    }).then(function () {
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  it('should return array of expenses', function (done) {
    request(app)
        .get('/api/expenses')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)
        .end(function (err, res) {
          if (err) throw new Error(err);
          res.body.should.instanceOf(Array).and.have.length(1);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('date', expense.date);
          res.body[0].should.have.property('memo', expense.memo);
          res.body[0].should.have.property('amount', expense.amount);
          res.body[0].should.have.property('UserId', user.id);
          done();
        });
  });

  it('should return 401 status code on not login', function (done) {
    request(app)
        .get('/api/expenses')
        .expect(401)
        .end(done);
  });
});

describe('GET /api/expenses/:id', function () {
  var user;
  var accessToken;
  var expense;

  before('Init database', function (done) {
    models.sequelize.sync({force: true}).then(function () {
      done();
    });
  });

  before('Create User and login', function (done) {
    models.User.create({
      email: 'account1@email.com',
      password: '123456'
    }).then(function (result) {
      user = result.get({plain: true});
      request(app)
          .post('/auth')
          .send({
            email: user.email,
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

  after('Destroy a user', function (done) {
    models.User.destroy({
      where: {
        id: user.id
      }
    }).then(function () {
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  before('Create a expense', function (done) {
    models.Expense.create({
      date: '2016-01-01',
      memo: 'memo 1',
      amount: 10000,
      UserId: user.id
    }).then(function (result) {
      expense = result.get({plain: true});
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  after('Remove the expense', function (done) {
    models.Expense.destroy({
      where: {
        id: expense.id
      }
    }).then(function () {
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  it('should return a expense by id', function (done) {
    request(app)
        .get('/api/expenses/' + expense.id)
        .set('authorization', 'Bearer ' + accessToken)
        .expect(200)
        .end(function (err, res) {
          if (err) throw new Error(err);
          res.body.should.have.property('id', expense.id);
          res.body.should.have.property('memo', expense.memo);
          res.body.should.have.property('amount', expense.amount);
          res.body.should.have.property('date', expense.date);
          res.body.should.have.property('UserId', user.id);
          done();
        });
  });
});


describe('PUT /api/expenses/:id', function () {
  var user;
  var accessToken;
  var expense;

  before('Init database', function (done) {
    models.sequelize.sync({force: true}).then(function () {
      done();
    });
  });

  before('Create User and login', function (done) {
    models.User.create({
      email: 'account1@email.com',
      password: '123456'
    }).then(function (result) {
      user = result.get({plain: true});
      request(app)
          .post('/auth')
          .send({
            email: user.email,
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

  after('Destroy a user', function (done) {
    models.User.destroy({
      where: {
        id: user.id
      }
    }).then(function () {
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  before('Create a expense', function (done) {
    models.Expense.create({
      date: '2016-01-01',
      memo: 'memo 1',
      amount: 10000,
      UserId: user.id
    }).then(function (result) {
      expense = result.get({plain: true});
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  after('Remove the expense', function (done) {
    models.Expense.destroy({
      where: {
        id: expense.id
      }
    }).then(function () {
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  it('should return a expense by id', function (done) {
    expense.amount = expense.amount + 1000;
    expense.memo = expense.memo + ' edited';
    request(app)
        .put('/api/expenses/' + expense.id)
        .set('authorization', 'Bearer ' + accessToken)
        .send({
          amount: expense.amount,
          memo: expense.memo
        })
        //.expect(200)
        .end(function (err, res) {
          if (err) throw new Error(err);
          res.body.should.have.property('id', expense.id);
          res.body.should.have.property('memo', expense.memo);
          res.body.should.have.property('amount', expense.amount);
          res.body.should.have.property('date', expense.date);
          res.body.should.have.property('UserId', user.id);
          done();
        });
  });
});