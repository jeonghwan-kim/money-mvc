/**
 * Created by Chris on 2016. 1. 21..
 */

var express = require('express'),
    ctrl = require('./echo.controller'),
    router = express.Router();

router.get('/', ctrl.index);

module.exports = router;
