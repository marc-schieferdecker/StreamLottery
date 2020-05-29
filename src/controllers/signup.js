'use strict';

let i18n = require("i18n");
let path = require('path');
let config = require(path.join(__dirname, '..', '..', 'config.json'));
let mailer = require(path.join(__dirname,'..','mailer'));
let striptags = require('striptags');
let momentTimezone = require('moment-timezone');

let controller = {
    index: (req, res) => {
        res.render('signup/form', {
            title: i18n.__("Sign up"),
            email: req.query.email,
            name: req.query.name,
            session: req.session,
            timezones: momentTimezone.tz.names(),
            timezone: momentTimezone.tz.guess()
        });
    },

    create: (req, res) => {
        let User = require(path.join(__dirname, '..', 'models', 'user'));
        let hbsConfig = req.app.get('hbsConfig');

        User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            timezone: req.body.timezone
        })
        .then((user)=>{
            // Send welcome mail
            let hbs = require('express-handlebars').create(hbsConfig);
            hbs.render(hbsConfig.templatesDir + '/email/welcome.'+i18n.getLocale()+'.hbs', {name: req.body.name}, {layout: false}).then((htmlMail)=>{
                mailer.send(req.body.email, i18n.__('Welcome to StreamLottery'), striptags(htmlMail), htmlMail);
            }).catch((e)=>{
                console.log(e);
            });

            // Create default setup for user
            let Setup = require(path.join(__dirname, '..', 'models', 'setup'));
            let defaultSetup = config.defaultSetup;
            defaultSetup.userId = user._id;
            Setup.create(defaultSetup);

            // Login user
            req.session.user = user;

            // Redirect to account page
            return res.redirect('/account');
        })
        .catch((error)=>{
            console.log('error creating user', error);

            // Render error(s)
            res.render('signup/form', {
                title: i18n.__("Error"),
                email: req.body.email,
                name: req.body.name,
                errors: error.errors,
                session: req.session
            });
        });
    }
};

module.exports = controller;