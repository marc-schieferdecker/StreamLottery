'use strict';

let i18n = require("i18n");
let ObjectId = require('mongoose').Types.ObjectId;
let path = require('path');
let config = require(path.join(__dirname, '..', '..', 'config.json'));
const { BitlyClient } = require('bitly');
const bitly = new BitlyClient(config.bitlyToken, {});

let controller = {
    index: (req, res) => {
        let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));

        // Check short links and create if necessary
        Lottery.find(
            {userId: new ObjectId(req.session.user._id)}
        ).then((lotterys)=> {
            lotterys.forEach(async (lottery, i) => {
                if (lottery.shortlinkForm == null || lottery.shortlinkForm === '') {
                    // Shorten link to form and store in db
                    try {
                        let shortlink = await bitly.shorten('https://' + config.domain + '/public/' + lottery._id + '/form');
                        lottery.shortlinkForm = shortlink.link;
                        lottery.save();
                    } catch (e) {
                        console.log(e);
                        reject();
                    }
                }
            });
        });

        res.render('account/index', {
            title: i18n.__("Your account"),
            session: req.session
        });
    },
};

module.exports = controller;