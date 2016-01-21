'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express();


function setStatic(client) {
  app.use(express.static(path.join(__dirname, '../../client/' + client)));
}

app.get('/api/echo', function (req, res) {
  res.json({
    message: req.query.message || 'Hello'
  });
});


module.exports = {
  app: http.createServer(app),

  setStatic: setStatic
};
