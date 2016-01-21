/**
 * Created by Chris on 2016. 1. 21..
 */

'use strict';

function index(req, res) {
  res.json({
    message: req.query.message || 'Hello'
  });
}

module.exports = {
  index: index
};
