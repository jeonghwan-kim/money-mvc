/**
 * Created by Chris on 2016. 1. 21..
 */

var express = require('express');
var ctrl = require('./expense.controller');
var router = express.Router();
var auth = require('../../auth/auth.service');

router.get('/', auth.isAuthenticated(), ctrl.index);
router.get('/:id', auth.isAuthenticated(), ctrl.show);
router.put('/:id', auth.isAuthenticated(), ctrl.update);

module.exports = router;
