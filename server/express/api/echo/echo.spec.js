/**
 * Created by Chris on 2016. 1. 21..
 */

var should = require('should'),
    request = require('supertest');
    app = require('../../').app;

describe('GET /api/echo', function () {
  it('should return json object with message', function (done) {
    request(app)
        .get('/api/echo?message=halo')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          res.body.should.have.property('message', 'halo');
          done();
        });
  });
});

