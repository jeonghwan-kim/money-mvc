/**
 * Created by Chris on 2016. 1. 23..
 */

var express = require('express'),
    ctrl = require('./auth.controller'),
    router = express.Router();

router.post('/', ctrl.login);
router.delete('/', ctrl.logout);

module.exports = router;
