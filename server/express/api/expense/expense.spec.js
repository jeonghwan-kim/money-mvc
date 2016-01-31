/**
 * Created by Chris on 2016. 1. 21..
 */

var _ = require('lodash'),
    should = require('should'),
    moment = require('moment'),
    request = require('supertest'),
    models = require('../../models'),
    app = require('../../app').app;

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

describe('GET /api/expenses?date=', function () {
  var user;
  var accessToken;
  var expenses;

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

  before('Create expenses', function (done) {
    var memo = 'memo ' + Date.now();
    models.Expense.bulkCreate([
      {date: '2016-01-01', memo: memo, amount: 10000, UserId: user.id},
      {date: '2016-02-02', memo: memo, amount: 10000, UserId: user.id},
      {date: '2016-03-02', memo: memo, amount: 10000, UserId: user.id}
    ]).then(function () {
      models.Expense.findAll({
        where: {memo: memo}
      }).then(function (results) {
        expenses = _.map(results, function (n) { return n.get({plain: true}); });
        done();
      })
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  after('Remove the expense', function (done) {
    models.Expense.destroy({
      where: {
        id: _.map(expenses, function(n) { return n.id; })
      }
    }).then(function () {
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  it('should filter by date', function (done) {
    request(app)
        .get('/api/expenses?date=2016-01')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          res.body.should.instanceOf(Array).and.have.length(1);
          moment(res.body[0].date, 'YYYY-MM-DD').year().should.be.equal(2016);
          moment(res.body[0].date, 'YYYY-MM-DD').month().should.be.equal(0);
          done();
        });
  });
});

describe('GET /api/expenses?search=', function () {
  var user;
  var accessToken;
  var expenses;

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

  before('Create expenses', function (done) {
    var memo = 'memo ' + Date.now();
    models.Expense.bulkCreate([
      {date: '2016-01-01', memo: memo + ' foo', amount: 10000, UserId: user.id},
      {date: '2016-02-02', memo: memo + ' bar', amount: 10000, UserId: user.id},
      {date: '2016-03-02', memo: memo + ' foo', amount: 10000, UserId: user.id}
    ]).then(function () {
      models.Expense.findAll({
        where: {memo: memo}
      }).then(function (results) {
        expenses = _.map(results, function (n) { return n.get({plain: true}); });
        done();
      })
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  after('Remove the expense', function (done) {
    models.Expense.destroy({
      where: {
        id: _.map(expenses, function(n) { return n.id; })
      }
    }).then(function () {
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  it('should search result', function (done) {
    request(app)
        .get('/api/expenses?search=foo')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          res.body.should.instanceOf(Array).and.have.length(2);
          res.body[0].memo.should.match(/foo/);
          res.body[1].memo.should.match(/foo/);
          done();
        });
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

describe('DELETE /api/expenses/:id', function () {
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

  after('Ensure the expense is removed', function (done) {
    models.Expense.findOne({
      where: {
        id: expense.id
      }
    }).then(function (r) {
      (r === null).should.be.equal(true);
      done()
    }).catch(function (e) {
      throw e;
    });
  });

  it('should remove expense', function (done) {
    expense.amount = expense.amount + 1000;
    expense.memo = expense.memo + ' edited';
    request(app)
        .delete('/api/expenses/' + expense.id)
        .set('authorization', 'Bearer ' + accessToken)
        .send()
        .expect(204)
        .end(done);
  })
});

describe('GET /api/expenses/meta', function () {
  var user;
  var accessToken;
  var expenses;

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

  before('Create expenses', function (done) {
    var memo = 'memo ' + Date.now();
    models.Expense.bulkCreate([
      {date: '2016-01-01', memo: memo + ' foo', amount: 10000, UserId: user.id},
      {date: '2016-02-02', memo: memo + ' bar', amount: 10000, UserId: user.id},
      {date: '2016-03-02', memo: memo + ' foo', amount: 10000, UserId: user.id}
    ]).then(function () {
      models.Expense.findAll({
        where: {memo: memo}
      }).then(function (results) {
        expenses = _.map(results, function (n) { return n.get({plain: true}); });
        done();
      })
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  after('Remove the expense', function (done) {
    models.Expense.destroy({
      where: {
        id: _.map(expenses, function(n) { return n.id; })
      }
    }).then(function () {
      done();
    }).catch(function (err) {
      throw new Error(err);
    });
  });

  it.only('should return dates array', function (done) {
    request(app)
        .get('/api/expenses/meta')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          res.body.should.have.property('dates', ['2016-03', '2016-02', '2016-01']);
          done();
        });
  });
});
