'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
const ctrl = require(path.join('..','controllers','profile'));

router.get('/', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.index(req, res);
});

router.post('/', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.save(req, res);
});

module.exports = router;
