/**
 * Created by Chris on 2016. 1. 21..
 */

var should = require('should'),
    request = require('supertest'),
    models = require('../../models'),
    app = require('../../').app;

describe('GET /api/expenses', function () {
  var expense;

  before('Sync database', function (done) {
    models.sequelize.sync({force: true}).then(function () {
      done();
    });
  });


  before('Create a expense', function (done) {
    models.Expense.create({
      date: '2016-01-01',
      memo: 'memo 1',
      amount: 10000
    }).then(function (result) {
      expense = result.get({plain: true});
      done();
    }).catch(function (err) {
      console.error(err);
      throw err;
    });
  });

  after('Remove the expense', function (done) {
    models.Expense.destroy({
      where: {id: expense.id}
    }).then(function () {
      done();
    }).catch(function (err) {
      throw err;
    });
  });

  it('should return array of expenses', function (done) {
    request(app)
        .get('/api/expenses')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          res.body.should.instanceOf(Array).and.have.length(1);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('date', expense.date);
          res.body[0].should.have.property('memo', expense.memo);
          res.body[0].should.have.property('amount', expense.amount);
          done();
        });
  });
});

