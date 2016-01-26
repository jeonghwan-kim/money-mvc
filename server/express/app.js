'use strict';

var path = require('path');
var express = require('express');
var models = require('./models');
var app = express();
var port = process.env.PORT || 3000;

function setStatic(client) {
  app.use(express.static(path.join(__dirname, '../../client/' + client)));
}

require('./config/express').setup(app);
require('./config/passport').setup();
require('./routes').setup(app);

if ('development' === app.get('env') || 'production' === app.get('env')) {
  models.sequelize.sync().then(function () {
    app.listen(port, function() {
      console.log('Express server listening on port ' + port);
    });
  });
}

module.exports ={
  setStatic: setStatic,
  app: app // For unit test
};
