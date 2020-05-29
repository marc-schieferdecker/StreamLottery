'use strict';

let express = require('express');
let router = express.Router();
let path = require('path');
const ctrl = require(path.join('..','controllers','setup'));

router.get('/', function(req, res, next) {
    // If user is not logged in, do not show this page
    if(typeof req.session.user === 'undefined') {
        return res.redirect('/signin');
    }

    ctrl.index(req, res);
});

router.get('/:openTab', function(req, res, next) {
    // If user is not logged in, do not show this page
    if(typeof req.session.user === 'undefined') {
        return res.redirect('/signin');
    }

    ctrl.index(req, res);
});

router.post('/:fieldname', function(req, res, next) {
    // If user is not logged in, do not show this page
    if(typeof req.session.user === 'undefined') {
        return res.redirect('/signin');
    }

    if(req.params.fieldname === 'setup') {
        ctrl.savesetup(req, res);
    }
    else {
        ctrl.imagesave(req, res);
    }
});

router.get('/setavatar/:id', function(req, res, next) {
    // If user is not logged in, do not show this page
    if(typeof req.session.user === 'undefined') {
        return res.redirect('/signin');
    }

    ctrl.setavatar(req, res);
});

router.get('/filedelete/:id/:openTab', function(req, res, next) {
    // If user is not logged in, do not show this page
    if(typeof req.session.user === 'undefined') {
        return res.redirect('/signin');
    }

    ctrl.filedelete(req, res);
});

module.exports = router;
