/**
 * Created by Chris on 2016. 1. 23..
 */

var bodyParser = require('body-parser');

function setup(app) {
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
}

module.exports = {
  setup: setup
};
