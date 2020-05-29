'use strict';

let i18n = require("i18n");
let path = require('path');
let ObjectId = require('mongoose').Types.ObjectId;
let config = require(path.join(__dirname, '..', '..', 'config.json'));
let socket = require(path.join(__dirname, '..', 'socket'));

let controller = {
    index: (req, res) => {
        let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));

        // Load lottery index of user
        Lottery.find(
            {userId: new ObjectId(req.session.user._id)}
        ).then((lotterys)=> {
            res.render('lotterys/index', {
                title: i18n.__("Your lotterys"),
                session: req.session,
                lotterys: lotterys.reverse()
            });
        }).catch((error)=> {
            console.log(error);
            res.render('lotterys/index', {
                title: i18n.__("Your lotterys"),
                session: req.session,
                errors: error.errors
            });
        });
    },

    publish: (req, res) => {
        let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));

        // Load lottery index of user
        Lottery.find(
            {userId: new ObjectId(req.session.user._id)}
        ).then((lotterys)=> {
            res.render('lotterys/publish', {
                title: i18n.__("Publish lotterys"),
                domain: config.domain,
                session: req.session,
                lotterys: lotterys.reverse()
            });
        }).catch((error)=> {
            console.log(error);
            res.render('lotterys/publish', {
                title: i18n.__("Publish lotterys"),
                session: req.session,
                error: error
            });
        });
    },

    addForm: async (req, res) => {
        let Media = require(path.join(__dirname, '..', 'models', 'media'));
        var media = null;

        // Load media
        await Media.find(
            {userId: new ObjectId(req.session.user._id)}
        )
        .then( (_media) => {
            media = _media;
        })
        .catch( (error) => {

        });

        res.render('lotterys/add', {
            title: i18n.__("Add lottery"),
            session: req.session,
            winningAnimationId: null,
            productImageId: null,
            media: media
        });
    },

    add: (req, res) => {
        let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));

        Lottery.create({
            userId: req.session.user._id,
            name: req.body.name,
            description: req.body.description,
            winningAnimationId: req.body.winningAnimationId !== '' ? req.body.winningAnimationId : null,
            productImageId: req.body.productImageId !== '' ? req.body.productImageId : null,
            winningSoundId: req.body.winningSoundId !== '' ? req.body.winningSoundId : null,
            newApplicantSoundId: req.body.newApplicantSoundId !== '' ? req.body.newApplicantSoundId : null,
            isPublic: req.body.isPublic
        }).then((lottery)=>{
            res.redirect('/lotterys');
        }).catch((error)=>{
            console.log(error);
            res.render('lotterys/add', {
                title: i18n.__("Add lottery"),
                session: req.session,
                name: req.body.name,
                description: req.body.description,
                isPublic: req.body.isPublic,
                errors: error.errors
            });
        });
    },

    editForm: async (req, res) => {
        let Media = require(path.join(__dirname, '..', 'models', 'media'));
        var media = null;

        // Load media
        await Media.find(
            {userId: new ObjectId(req.session.user._id)}
        )
        .then( (_media) => {
            media = _media;
        })
        .catch( (error) => {

        });

        let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));
        Lottery.findOne({
                _id: req.params.id,
                userId: new ObjectId(req.session.user._id)
            }
        )
        .then((lottery)=>{
            res.render('lotterys/edit', {
                title: i18n.__("Edit lottery"),
                session: req.session,
                _id: lottery._id,
                name: lottery.name,
                description: lottery.description,
                winningAnimationId: lottery.winningAnimationId,
                productImageId: lottery.productImageId,
                winningSoundId: lottery.winningSoundId,
                newApplicantSoundId: lottery.newApplicantSoundId,
                isPublic: lottery.isPublic,
                media: media
            });
        })
        .catch((error)=>{
            res.render('lotterys/edit', {
                title: i18n.__("Edit lottery"),
                session: req.session,
                errors: error.errors
            });
        });
    },

    edit: async (req, res) => {
        let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));
        let Media = require(path.join(__dirname, '..', 'models', 'media'));
        var media = null;

        // Load media
        await Media.find(
            {userId: new ObjectId(req.session.user._id)}
        )
        .then( (_media) => {
            media = _media;
        })
        .catch( (error) => {

        });

        Lottery.findOne({
                _id: req.params.id,
                userId: new ObjectId(req.session.user._id)
            }
        )
        .then((lottery)=>{
            lottery.name = req.body.name;
            lottery.description = req.body.description;
            lottery.winningAnimationId = req.body.winningAnimationId !== '' ? req.body.winningAnimationId : null;
            lottery.productImageId = req.body.productImageId !== '' ? req.body.productImageId : null;
            lottery.winningSoundId = req.body.winningSoundId !== '' ? req.body.winningSoundId : null;
            lottery.newApplicantSoundId = req.body.newApplicantSoundId !== '' ? req.body.newApplicantSoundId : null;
            lottery.isPublic = req.body.isPublic;
            lottery.save()
                .then((lottery)=>{
                    res.redirect('/lotterys');
                })
                .catch((errors)=>{
                    res.render('lotterys/edit', {
                        title: i18n.__("Edit lottery"),
                        session: req.session,
                        _id: req.params.id,
                        name: req.body.name,
                        description: req.body.description,
                        isPublic: req.body.isPublic,
                        media: media
                    });
                });
        })
        .catch((error)=>{
            console.log(error);
            res.render('lotterys/edit', {
                title: i18n.__("Edit lottery"),
                session: req.session,
                _id: req.params.id,
                name: req.body.name,
                description: req.body.description,
                isPublic: req.body.isPublic,
                errors: error.errors,
                media: media
            });
        });
    },

    delete: (req, res) => {
        let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));

        Lottery.findOne({
                _id: req.params.id,
                userId: new ObjectId(req.session.user._id)
            }
        )
        .then((lottery)=>{
            lottery.remove();
        })
        .catch((error)=>{
            console.log(error);
        });
        res.redirect('/lotterys');
    },

    simulate: (req, res, what) => {
        let Lottery = require(path.join(__dirname, '..', 'models', 'lottery'));
        if(what === 'applicant') {
            let msg = new socket.messageTypeNewApplicant();
            msg.setData(req.params.id, 'John Doe', 'I hope to win!');
            if(socket.socketHandler.clients.length > 0) {
                let clients = socket.socketHandler.clients.filter(c => c.handshake.query.lotteryId === req.params.id);
                if(clients.length) {
                    clients.forEach((client)=>{
                        client.emit(msg.type, msg);
                    });
                }
            }
        }
        if(what === 'winner') {
            let msg = new socket.messageTypeDrawWinner();
            msg.setData(req.params.id, 'John Doe', 'Yeah, I won!');
            if(socket.socketHandler.clients.length > 0) {
                let clients = socket.socketHandler.clients.filter(c => c.handshake.query.lotteryId === req.params.id);
                if(clients.length) {
                    clients.forEach((client)=>{
                        client.emit(msg.type, msg);
                    });
                }
            }
        }
        res.redirect('/lotterys/publish');
    },

    drawwinner: async (req, res) => {
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

            if (lottery != null && lottery.isPublic && lottery.applicants.length > 0) {
                let winner = lottery.applicants[Math.floor(Math.random()*lottery.applicants.length)];
                if(winner) {
                    lottery.winner = winner._id;
                    lottery.isPublic = false;
                    await lottery.save();

                    // Run winning animation
                    let msg = new socket.messageTypeDrawWinner();
                    msg.setData(req.params.id, winner.publicName, winner.publicWinningMessage);
                    if(socket.socketHandler.clients.length > 0) {
                        let clients = socket.socketHandler.clients.filter(c => c.handshake.query.lotteryId === req.params.id);
                        if(clients.length) {
                            clients.forEach((client)=>{
                                client.emit(msg.type, msg);
                            });
                        }
                    }
                }
            }

            res.redirect('/lotterys/publish');
        }
        else {
            res.redirect('/lotterys/publish');
        }
    },

    stats: async (req, res) => {
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
            res.render('lotterys/stats', {
                title: i18n.__("Lottery statistics"),
                session: req.session,
                lottery: lottery
            });
        }
        else {
            res.render('lotterys/stats', {
                title: i18n.__("Lottery statistics"),
                session: req.session,
                error: i18n.__("Error loading lottery.")
            });
        }
    }
};

module.exports = controller;
