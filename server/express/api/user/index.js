/**
 * Created by Chris on 2016. 1. 21..
 */

var express = require('express'),
    ctrl = require('./user.controller'),
    router = express.Router();

router.post('/', ctrl.create);

module.exports = router;
