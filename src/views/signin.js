'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
const ctrl = require(path.join('..','controllers','signin'));

router.get('/', function(req, res, next) {
  // If user is logged in, do not show this page anymore
  if(typeof req.session.user !== 'undefined') {
    return res.redirect('/account');
  }

  ctrl.index(req, res);
});

router.post('/', function(req, res, next) {
  // If user is logged in, do not show this page anymore
  if(typeof req.session.user !== 'undefined') {
    return res.redirect('/account');
  }

  ctrl.login(req,res);
});

module.exports = router;
