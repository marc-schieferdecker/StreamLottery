'use strict';

let i18n = require("i18n");
let path = require('path');
let momentTimezone = require('moment-timezone');

let controller = {
    index: (req, res) => {
        let User = require(path.join(__dirname, '..', 'models', 'user'));

        User.findOne({
            _id: req.session.user._id
        })
        .then((user)=>{
            res.render('profile/form', {
                title: i18n.__("Manage account"),
                session: req.session,
                name: user.name,
                email: user.email,
                timezone: user.timezone ? user.timezone : momentTimezone.tz.guess(),
                timezones: momentTimezone.tz.names()
            });
        })
        .catch((error)=>{
            res.render('profile/form', {
                title: i18n.__("Manage account"),
                error: i18n.__("That was not successfull."),
                session: req.session
            });
        });
    },

    save: (req, res) => {
        let User = require(path.join(__dirname, '..', 'models', 'user'));

        User.findOne({
            _id: req.session.user._id
        })
        .then((user)=>{
            // Set new values
            user.name = user.name != req.body.name ? req.body.name : user.name;
            user.timezone = user.timezone != req.body.timezone ? req.body.timezone : user.timezone;
            user.email = user.email != req.body.email ? req.body.email : user.email;
            if(req.body.password !== '') {
                user.password = req.body.password;
            }
            user.save().then((user)=>{
                // Set new data to session
                req.session.user = user;

                res.render('profile/form', {
                    title: i18n.__("Manage account"),
                    success: i18n.__("Saved."),
                    session: req.session,
                    name: user.name,
                    email: user.email,
                    timezone: user.timezone,
                    timezones: momentTimezone.tz.names()
                });
            })
            .catch((error)=>{
                res.render('profile/form', {
                    title: i18n.__("Manage account"),
                    success: i18n.__("Saved."),
                    session: req.session,
                    name: user.name,
                    email: user.email,
                    timezone: user.timezone,
                    timezones: momentTimezone.tz.names(),
                    errors: error.errors
                });
            });
        })
        .catch((error)=>{
            res.render('profile/form', {
                title: i18n.__("Manage account"),
                error: i18n.__("That was not successfull."),
                session: req.session
            });
        });
    }
};

module.exports = controller;