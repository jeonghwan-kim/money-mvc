/**
 * Created by Chris on 2016. 1. 21..
 */

var express = require('express');
var ctrl = require('./user.controller');
var auth  = require('../../auth/auth.service');
var router = express.Router();

router.post('/', ctrl.create);
router.get('/me', auth.isAuthenticated(), ctrl.me);

module.exports = router;
