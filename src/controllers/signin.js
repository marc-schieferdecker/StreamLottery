'use strict';

let i18n = require("i18n");
let path = require('path');

let controller = {
    index: (req, res) => {
        res.render('signin/form', {
            title: i18n.__("Sign in"),
            email: req.query.email,
            session: req.session
        });
    },

    login: (req, res) => {
        let User = require(path.join(__dirname, '..', 'models', 'user'));

        User.findOne({
            email: req.body.email
        }, (error,user) => {
            if(user != null) {
                if( user.validPassword(req.body.password) ) {
                    // Login user
                    req.session.user = user;

                    // Redirect to account page
                    return res.redirect('/account');
                }
            }

            // No valid user found, send error
            res.render('signin/form', {
                title: i18n.__("Error"),
                email: req.body.email,
                error: i18n.__('Login failed.'),
                session: req.session
            });
        });
    }
};

module.exports = controller;