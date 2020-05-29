'use strict';

var express = require('express');
var router = express.Router();
var i18n = require("i18n");

router.get('/', function(req, res, next) {
  // If user is logged in, do not show the home page anymore
  if(typeof req.session.user !== 'undefined') {
    res.redirect('/account');
  }
  // Show home page
  else {
    res.render('home/home', {
      title: i18n.__("Welcome"),
      session: req.session
    });
  }
});

module.exports = router;
