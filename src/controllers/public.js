'use strict';

let i18n = require("i18n");
let path = require('path');
let config = require(path.join(__dirname, '..', '..', 'config.json'));
const { BitlyClient } = require('bitly');
const bitly = new BitlyClient(config.bitlyToken, {});
let socket = require(path.join(__dirname, '..', 'socket'));

let controller = {
    addApplicantForm: async (req, res) => {
        if(req.params.id) {
            let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));
            var lottery = null;

            // Get lottery
            await Lottery.findOne({_id: req.params.id})
            .then((_lottery) => {
                lottery = _lottery;
            })
            .catch((error) => {
                console.log(error);
            });

            if (lottery != null && lottery.isPublic) {
                res.render('public/form', {
                    title: i18n.__('Apply for a lottery'),
                    lottery: lottery
                });
            }
            else {
                // If no lottery found, draw error
                res.render('public/form', {
                    title: i18n.__('Apply for a lottery'),
                    lottery: null,
                    error: i18n.__("There is no such lottery, or it's not available yet.")
                });
            }
        }
        else {
            // If no lottery id is set, send a 404 not found
            res.status(404).send('Not found');
        }
    },

    addApplicant: async (req, res) => {
        if(req.params.id) {
            let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));
            let Applicant = require(path.join(__dirname, '..', 'models', 'applicant'));
            var lottery = null;
            var isDuplicate = undefined;

            // Get lottery
            await Lottery.findOne({_id: req.params.id})
            .then(async (_lottery) => {
                lottery = _lottery;
                // Check for duplicate email addresses
                isDuplicate = await lottery.applicants.find(applicant => applicant.email === req.body.email);
            })
            .catch((error) => {
                console.log(error);
            });

            if (lottery != null && lottery.isPublic) {
                if(isDuplicate !== undefined) {
                    res.render('public/form', {
                        title: i18n.__('Apply for a lottery'),
                        error: i18n.__('You already applied for this lottery.'),
                        lottery: lottery
                    });
                }
                else {
                    // Add applicant
                    Applicant.create({
                        lotteryId: lottery._id,
                        email: req.body.email,
                        publicName: req.body.publicName.substring(0,20),
                        publicMessage: req.body.publicMessage.substring(0,40),
                        publicWinningMessage: req.body.publicWinningMessage.substring(0,40),
                        deliverName: req.body.deliverName,
                        deliverStreet: req.body.deliverStreet,
                        deliverZip: req.body.deliverZip,
                        deliverTown: req.body.deliverTown,
                        deliverCountry: req.body.deliverCountry
                    }).then(async (applicant)=>{
                        // Store applicant in lottery
                        lottery.applicants.push(applicant);
                        await lottery.save();

                        // Send socket msg
                        let msg = new socket.messageTypeNewApplicant();
                        msg.setData(req.params.id, applicant.publicName, applicant.publicMessage);
                        if(socket.socketHandler.clients.length > 0) {
                            let clients = socket.socketHandler.clients.filter(c => c.handshake.query.lotteryId === req.params.id);
                            if(clients.length) {
                                clients.forEach((client)=>{
                                    client.emit(msg.type, msg);
                                });
                            }
                        }

                        res.render('public/form', {
                            title: i18n.__('You applied for this lottery'),
                            lottery: lottery,
                            applicant: applicant
                        });
                    }).catch((error)=>{
                        console.log(error);
                        res.render('public/form', {
                            title: i18n.__('Apply for a lottery'),
                            lottery: lottery,
                            errors: error.errors
                        });
                    });
                }
            }
            else {
                // If no lottery found, draw error
                res.render('public/form', {
                    title: i18n.__('Apply for a lottery'),
                    lottery: null,
                    error: i18n.__("There is no such lottery, or it's not available yet.")
                });
            }
        }
        else {
            // If no lottery id is set, send a 404 not found
            res.status(404).send('Not found');
        }
    },

    applicant: async (req, res) => {
        if(req.params.id) {
            let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));
            var lottery = null;

            // Get lottery
            await Lottery.findOne({_id: req.params.id})
            .then((_lottery) => {
                lottery = _lottery;
            })
            .catch((error) => {
                console.log(error);
            });

            if (lottery != null) {
                res.render('public/applicant', {
                    layout: 'public',
                    title: 'Lottery widget',
                    lottery: lottery,
                    preview: req.query.preview
                });
            }
            else {
                // If no lottery found, send a 404 not found
                res.status(404).send('Not found');
            }
        }
        else {
            // If no lottery id is set, send a 404 not found
            res.status(404).send('Not found');
        }
    },

    winner: async (req, res) => {
        if(req.params.id) {
            let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));
            var lottery = null;

            // Get lottery
            await Lottery.findOne({_id: req.params.id})
            .then((_lottery) => {
                lottery = _lottery;
            })
            .catch((error) => {
                console.log(error);
            });

            if (lottery != null) {
                res.render('public/winner', {
                    layout: 'public',
                    title: 'Lottery widget',
                    lottery: lottery,
                    preview: req.query.preview
                });
            }
            else {
                // If no lottery found, send a 404 not found
                res.status(404).send('Not found');
            }
        }
        else {
            // If no lottery id is set, send a 404 not found
            res.status(404).send('Not found');
        }
    },

    widget: async (req, res) => {
        if(req.params.id) {
            let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));
            var lottery = null;

            // Get lottery
            await Lottery.findOne({_id: req.params.id})
            .then((_lottery) => {
                lottery = _lottery;
            })
            .catch((error) => {
                console.log(error);
            });

            if(lottery != null) {
                if(lottery.shortlinkForm == null || lottery.shortlinkForm === '') {
                    // Shorten link to form and store in db
                    try {
                        let shortlink = await bitly.shorten('https://' + config.domain + '/public/' + lottery._id + '/form');
                        lottery.shortlinkForm = shortlink.link;
                        lottery.save();
                    } catch (e) {
                        console.log(e);
                    }
                }

                res.render('public/widget', {
                    layout: 'public',
                    title: 'Lottery widget',
                    lottery: lottery,
                    preview: req.query.preview
                });
            }
            else {
                // If no lottery found, send a 404 not found
                res.status(404).send('Not found');
            }
        }
        else {
            // If no lottery id is set, send a 404 not found
            res.status(404).send('Not found');
        }
    }
};

module.exports = controller;
