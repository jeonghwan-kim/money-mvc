/**
 * Created by Chris on 2016. 1. 21..
 */

var express = require('express');
var ctrl = require('./expense.controller');
var router = express.Router();
var auth = require('../../auth/auth.service');

router.get('/meta', auth.isAuthenticated(), ctrl.meta);
router.get('/', auth.isAuthenticated(), ctrl.index);
router.get('/:id', auth.isAuthenticated(), ctrl.show);
router.put('/:id', auth.isAuthenticated(), ctrl.update);
router.delete('/:id', auth.isAuthenticated(), ctrl.destroy);

module.exports = router;
