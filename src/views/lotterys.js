'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
const ctrl = require(path.join('..','controllers','lotterys'));

router.get('/', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.index(req, res);
});

router.get('/add', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.addForm(req, res);
});

router.post('/add', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.add(req, res);
});

router.get('/edit/:id', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.editForm(req, res);
});

router.post('/edit/:id', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.edit(req, res);
});

router.get('/delete/:id', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.delete(req, res);
});

router.get('/publish', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.publish(req, res);
});

router.get('/simulate/applicant/:id', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.simulate(req, res, 'applicant');
});

router.get('/simulate/winner/:id', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.simulate(req, res, 'winner');
});

router.get('/drawwinner/:id', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.drawwinner(req, res);
});

router.get('/stats/:id', function(req, res, next) {
  // If user is not logged in, do not show this page
  if(typeof req.session.user === 'undefined') {
    return res.redirect('/signin');
  }

  ctrl.stats(req, res);
});

module.exports = router;
