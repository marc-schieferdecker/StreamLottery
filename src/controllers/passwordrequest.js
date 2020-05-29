'use strict';

let i18n = require("i18n");
let path = require('path');
let mailer = require(path.join(__dirname,'..','mailer'));
let striptags = require('striptags');
let crypto = require('crypto');

let controller = {
    index: (req, res) => {
        res.render('passwordrequest/form', {
            title: i18n.__("Reset password"),
            email: req.params.email
        });
    },

    send: (req, res) => {
        let User = require(path.join(__dirname, '..', 'models', 'user'));
        let hbsConfig = req.app.get('hbsConfig');

        User.findOne({
            email: req.body.email
        })
        .then((user)=>{
            // Generate and set new password
            let newPassword = crypto.randomBytes(4).toString('hex');
            user.password = newPassword;
            user.save();

            // Reset password mail
            let hbs = require('express-handlebars').create(hbsConfig);
            hbs.render(hbsConfig.templatesDir + '/email/newpassword.'+i18n.getLocale()+'.hbs', {password: newPassword}, {layout: false}).then((htmlMail)=>{
                mailer.send(req.body.email, i18n.__('Your new password at StreamLottery'), striptags(htmlMail), htmlMail);
            }).catch((e)=>{
                console.log(e);
            });

            res.render('passwordrequest/form', {
                title: i18n.__("Reset password"),
                success: i18n.__("A new password has been mailed to you."),
                email: req.body.email
            });
        })
        .catch((error)=>{
            res.render('passwordrequest/form', {
                title: i18n.__("Reset password"),
                error: i18n.__("That was not successfull."),
                email: req.body.email
            });
        });
    }
};

module.exports = controller;