'use strict';

const path = require('path');
const nodemailer = require('nodemailer');
const config = require(path.join(__dirname,'..','config.json'));

let mailer = {
    /**
     * Configure transport
     */
    transport: nodemailer.createTransport({
        host: config.smtpServer,
        port: config.smtpPort,
        secure: config.smtpSecure,
        auth: {
            user: config.smtpUser,
            pass: config.smtpPass
        },
        tls: {
            rejectUnauthorized: config.smtpCheckCertificate
        }
    }),

    /**
     * Send mail
     * @param to
     * @param subject
     * @param text
     * @param html
     */
    send: (to, subject, text, html) => {
        mailer.transport.sendMail({
            from: '"' + config.mailFromName + '" <' + config.mailFrom + '>',
            to: to,
            subject: subject,
            text: text,
            html: html
        });
    }
};

module.exports = mailer;
