'use strict';

var express = require('express');
var router = express.Router();
var i18n = require("i18n");

router.get('/about', function(req, res, next) {
  res.render('static/'+i18n.getLocale()+'/about', {
    title: i18n.__("About"),
    session: req.session
  });
});

router.get('/contact', function(req, res, next) {
  res.render('static/'+i18n.getLocale()+'/contact', {
    title: i18n.__("Contact"),
    session: req.session
  });
});

router.get('/terms', function(req, res, next) {
  res.render('static/'+i18n.getLocale()+'/terms', {
    title: i18n.__("Terms of use"),
    session: req.session
  });
});

router.get('/privacy', function(req, res, next) {
  res.render('static/'+i18n.getLocale()+'/privacy', {
    title: i18n.__("Privacy policy"),
    session: req.session
  });
});

module.exports = router;
