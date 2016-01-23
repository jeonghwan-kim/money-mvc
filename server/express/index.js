'use strict';

var path = require('path'),
    express = require('express'),
    models = require('./models'),
    app = express(),
    port;

port = process.env.PORT || 3000;

require('./config/express').setup(app);
require('./routes')(app);
require('./config/passport').setup();

function setStatic(client) {
  app.use(express.static(path.join(__dirname, '../../client/' + client)));
}

function run(cb) {
  models.sequelize.sync({force: true}).then(function () {
    app.listen(port, function() {
      console.log('Express server listening on port ' + port);
      cb();
    });
  });
}

module.exports ={
  setStatic: setStatic,
  run: run,
  app: app // For unit test
};
