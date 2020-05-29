'use strict';

var express = require('express');
var router = express.Router();
var i18n = require("i18n");
var path = require('path');
const ctrl = require(path.join('..','controllers','public'));

router.get('/:id', function(req, res, next) {
  ctrl.widget(req, res);
});

router.get('/:id/applicant', function(req, res, next) {
  ctrl.applicant(req, res);
});

router.get('/:id/winner', function(req, res, next) {
  ctrl.winner(req, res);
});

router.get('/:id/form', function(req, res, next) {
  ctrl.addApplicantForm(req, res);
});

router.post('/:id/form', function(req, res, next) {
  ctrl.addApplicant(req, res);
});

module.exports = router;
