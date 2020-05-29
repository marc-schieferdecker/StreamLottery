'use strict';

let i18n = require("i18n");
let path = require('path');
let config = require(path.join(__dirname, '..', '..', 'config.json'));
let cloudinary = require(path.join(__dirname,'..','cloudinary'));
let ObjectId = require('mongoose').Types.ObjectId;

let controller = {
    index: async (req, res) => {
        let Media = require(path.join(__dirname, '..', 'models', 'media'));
        let Setup = require(path.join(__dirname, '..', 'models', 'setup'));
        let openTab = req.params.openTab ? req.params.openTab : 'avatar';

        // Load setup
        var setup = null;
        await Setup.findOne({
            userId: new ObjectId(req.session.user._id)
        })
        .then( (_setup) => {
            setup = _setup;

            // Set default setup if no config for user exists
            if(setup == null) {
                setup = config.defaultSetup;
            }
        }).catch( (error) => {
            console.log(error);
        });

        Media.find(
            {userId: new ObjectId(req.session.user._id)}
        )
        .then( (media) => {
            res.render('setup/index', {
                title: i18n.__("Global setup"),
                media: media,
                widgetTitle: setup.widgetTitle ? setup.widgetTitle : null,
                widgetHeaderBackgroundColor: setup.widgetHeaderBackgroundColor ? setup.widgetHeaderBackgroundColor : null,
                widgetHeaderTextColor: setup.widgetHeaderTextColor ? setup.widgetHeaderTextColor : null,
                widgetHeaderTextAlign: setup.widgetHeaderTextAlign ? setup.widgetHeaderTextAlign : null,
                widgetHeaderShowAvatar: setup.widgetHeaderShowAvatar ? setup.widgetHeaderShowAvatar : null,
                widgetHeaderAvatarAlign: setup.widgetHeaderAvatarAlign ? setup.widgetHeaderAvatarAlign : null,
                widgetHeaderAvatarRounded: setup.widgetHeaderAvatarRounded ? setup.widgetHeaderAvatarRounded : null,
                widgetBodyBackgroundColor: setup.widgetBodyBackgroundColor ? setup.widgetBodyBackgroundColor : null,
                widgetBodyTextColor: setup.widgetBodyTextColor ? setup.widgetBodyTextColor : null,
                widgetBodyTextAlign: setup.widgetBodyTextAlign ? setup.widgetBodyTextAlign : null,
                widgetShowShortlink: setup.widgetShowShortlink ? setup.widgetShowShortlink : null,
                widgetShowShortPrependText: setup.widgetShowShortPrependText ? setup.widgetShowShortPrependText : null,
                widgetImageTransparency: setup.widgetImageTransparency ? setup.widgetImageTransparency : null,
                widgetBodyImagePadding: setup.widgetBodyImagePadding ? setup.widgetBodyImagePadding : null,
                applicantTitle: setup.applicantTitle ? setup.applicantTitle : null,
                applicantHeaderBackgroundColor: setup.applicantHeaderBackgroundColor ? setup.applicantHeaderBackgroundColor : null,
                applicantHeaderTextColor: setup.applicantHeaderTextColor ? setup.applicantHeaderTextColor : null,
                applicantHeaderTextAlign: setup.applicantHeaderTextAlign ? setup.applicantHeaderTextAlign : null,
                applicantBodyBackgroundColor: setup.applicantBodyBackgroundColor ? setup.applicantBodyBackgroundColor : null,
                applicantBodyTextColor: setup.applicantBodyTextColor ? setup.applicantBodyTextColor : null,
                applicantBodyTextAlign: setup.applicantBodyTextAlign ? setup.applicantBodyTextAlign : null,
                applicantAnimationFrom: setup.applicantAnimationFrom ? setup.applicantAnimationFrom : null,
                applicantAnimationTo: setup.applicantAnimationTo ? setup.applicantAnimationTo : null,
                applicantAnimationDelay: setup.applicantAnimationDelay ? setup.applicantAnimationDelay : null,
                applicantAnimationMoveSpeed: setup.applicantAnimationMoveSpeed ? setup.applicantAnimationMoveSpeed : null,
                applicantAnimationSoundVolume: setup.applicantAnimationSoundVolume ? setup.applicantAnimationSoundVolume : null,
                winnerTitle: setup.winnerTitle ? setup.winnerTitle : null,
                winnerHeaderBackgroundColor: setup.winnerHeaderBackgroundColor ? setup.winnerHeaderBackgroundColor : null,
                winnerHeaderTextColor: setup.winnerHeaderTextColor ? setup.winnerHeaderTextColor : null,
                winnerHeaderTextAlign: setup.winnerHeaderTextAlign ? setup.winnerHeaderTextAlign : null,
                winnerBodyBackgroundColor: setup.winnerBodyBackgroundColor ? setup.winnerBodyBackgroundColor : null,
                winnerBodyTextColor: setup.winnerBodyTextColor ? setup.winnerBodyTextColor : null,
                winnerBodyTextAlign: setup.winnerBodyTextAlign ? setup.winnerBodyTextAlign : null,
                winnerAnimationFrom: setup.winnerAnimationFrom ? setup.winnerAnimationFrom : null,
                winnerAnimationTo: setup.winnerAnimationTo ? setup.winnerAnimationTo : null,
                winnerAnimationDelay: setup.winnerAnimationDelay ? setup.winnerAnimationDelay : null,
                winnerAnimationMoveSpeed: setup.winnerAnimationMoveSpeed ? setup.winnerAnimationMoveSpeed : null,
                winnerAnimationSoundVolume: setup.winnerAnimationSoundVolume ? setup.winnerAnimationSoundVolume : null,
                session: req.session,
                openTab: openTab
            });
        })
        .catch( (error) => {
            res.render('setup/index', {
                title: i18n.__("Global setup"),
                media: null,
                error: error,
                session: req.session,
                openTab: openTab
            });
        });
    },

    imagesave: (req, res) => {
        let fieldname = req.params.fieldname;
        switch (fieldname) {
            case "avatar":
                var Upload = cloudinary.AvatarUpload().single(fieldname);
                break;
            case "animation":
                var Upload = cloudinary.AnimationsUpload().single(fieldname);
                break;
            case "image":
                var Upload = cloudinary.ImagesUpload().single(fieldname);
                break;
            case "sound":
                var Upload = cloudinary.SoundsUpload().single(fieldname);
                break;
            default:
                var Upload = cloudinary.ImagesUpload().single(fieldname);
        }
        let Media = require(path.join(__dirname, '..', 'models', 'media'));
        let User = require(path.join(__dirname, '..', 'models', 'user'));

        Media.find(
            {userId: new ObjectId(req.session.user._id)}
        )
        .then( (media) => {
            Upload(req, res, function (error) {
                if (error) {
                    // Render upload error
                    res.render('setup/index', {
                        title: i18n.__("Global setup"),
                        media: media,
                        error: error,
                        session: req.session,
                        openTab: fieldname
                    });
                }
                else {
                    // Create media in db
                    Media.create({
                        userId: new ObjectId(req.session.user._id),
                        fieldname: fieldname,
                        originalname: req.file.originalname,
                        mimetype: req.file.mimetype,
                        format: req.file.format,
                        bytes: req.file.bytes,
                        public_id: req.file.public_id,
                        url: req.file.url,
                        secure_url: req.file.secure_url
                    })
                    .then( (crmedia) => {
                        // Add new media to media array
                        media.push(crmedia);

                        // Set new avatar for user
                        if(fieldname === 'avatar') {
                            User.findOneAndUpdate({_id: new ObjectId(req.session.user._id)}, {$set: {avatarId: new ObjectId(crmedia._id)}}, (upderror, user) => {
                                if (upderror) {
                                    res.render('setup/index', {
                                        title: i18n.__("Global setup"),
                                        media: media,
                                        error: upderror,
                                        session: req.session,
                                        openTab: fieldname
                                    });
                                } else {
                                    res.redirect('/setup/'+fieldname);
                                }
                            });
                        }
                        else {
                            res.redirect('/setup/'+fieldname);
                        }
                    })
                    .catch( (crerror) => {
                        res.render('setup/index', {
                            title: i18n.__("Global setup"),
                            media: media,
                            error: crerror,
                            session: req.session,
                            openTab: fieldname
                        });
                    });
                }
            });
        })
        .catch( (error) => {
            // Error loading media
            res.render('setup/index', {
                title: i18n.__("Global setup"),
                media: null,
                error: error,
                session: req.session,
                openTab: fieldname
            });
        });
    },

    filedelete: (req, res) => {
        let Media = require(path.join(__dirname, '..', 'models', 'media'));
        let User = require(path.join(__dirname, '..', 'models', 'user'));
        let openTab = req.params.openTab ? req.params.openTab : 'avatar';

        Media.findOne(
            {
                _id: new ObjectId(req.params.id),
                userId: new ObjectId(req.session.user._id)
            }
        )
        .then( (media) => {
            cloudinary.deleteFile(media.public_id)
            .then( (success) => {
                // Delete media from db
                media.remove()
                .then( (result) => {
                    res.redirect('/setup/'+openTab);
                })
                .catch( (error) => {
                    res.render('setup/index', {
                        title: i18n.__("Global setup"),
                        media: null,
                        error: error,
                        session: req.session,
                        openTab: openTab
                    });
                });
            })
            .catch( (error) => {
                res.render('setup/index', {
                    title: i18n.__("Global setup"),
                    media: null,
                    error: error.error.message,
                    session: req.session,
                    openTab: openTab
                });
            });
        })
        .catch( (error) => {
            // Error loading media
            res.render('setup/index', {
                title: i18n.__("Global setup"),
                media: null,
                error: error,
                session: req.session,
                openTab: openTab
            });
        });
    },

    setavatar: (req, res) => {
        let Media = require(path.join(__dirname, '..', 'models', 'media'));
        let User = require(path.join(__dirname, '..', 'models', 'user'));
        Media.findOne({
            _id: new ObjectId(req.params.id),
            userId: new ObjectId(req.session.user._id)
        })
        .then( (media) => {
            // Set new avatar for user
            User.findOneAndUpdate({_id: new ObjectId(req.session.user._id)}, {$set:{avatarId: new ObjectId(media._id)}}, (upderror, user) => {
                if(upderror) {
                    res.render('setup/index', {
                        title: i18n.__("Global setup"),
                        media: media,
                        error: upderror,
                        session: req.session,
                        openTab: 'avatar'
                    });
                }
                else {
                    res.redirect('/setup/avatar');
                }
            });
        })
        .catch( (error) => {
            // Error loading media
            res.render('setup/index', {
                title: i18n.__("Global setup"),
                media: null,
                error: error,
                session: req.session,
                openTab: 'avatar'
            });
        });
    },

    savesetup: (req, res) => {
        let Setup = require(path.join(__dirname, '..', 'models', 'setup'));
        Setup.findOne({
            userId: new ObjectId(req.session.user._id)
        })
        .then( (setup) => {
            if(setup == null) {
                Setup.create({
                    userId: req.session.user._id,
                    widgetTitle: req.body.widgetTitle,
                    widgetHeaderBackgroundColor: req.body.widgetHeaderBackgroundColor,
                    widgetHeaderTextColor: req.body.widgetHeaderTextColor,
                    widgetHeaderTextAlign: req.body.widgetHeaderTextAlign,
                    widgetHeaderShowAvatar: req.body.widgetHeaderShowAvatar,
                    widgetHeaderAvatarAlign: req.body.widgetHeaderAvatarAlign,
                    widgetHeaderAvatarRounded: req.body.widgetHeaderAvatarRounded,
                    widgetBodyBackgroundColor: req.body.widgetBodyBackgroundColor,
                    widgetBodyTextColor: req.body.widgetBodyTextColor,
                    widgetBodyTextAlign: req.body.widgetBodyTextAlign,
                    widgetShowShortlink: req.body.widgetShowShortlink,
                    widgetShowShortPrependText: req.body.widgetShowShortPrependText,
                    widgetImageTransparency: req.body.widgetImageTransparency,
                    widgetBodyImagePadding: req.body.widgetBodyImagePadding,
                    applicantTitle: req.body.applicantTitle,
                    applicantHeaderBackgroundColor: req.body.applicantHeaderBackgroundColor,
                    applicantHeaderTextColor: req.body.applicantHeaderTextColor,
                    applicantHeaderTextAlign: req.body.applicantHeaderTextAlign,
                    applicantBodyBackgroundColor: req.body.applicantBodyBackgroundColor,
                    applicantBodyTextColor: req.body.applicantBodyTextColor,
                    applicantBodyTextAlign: req.body.applicantBodyTextAlign,
                    applicantAnimationFrom: req.body.applicantAnimationFrom,
                    applicantAnimationTo: req.body.applicantAnimationTo,
                    applicantAnimationDelay: req.body.applicantAnimationDelay,
                    applicantAnimationMoveSpeed: req.body.applicantAnimationMoveSpeed,
                    applicantAnimationSoundVolume: req.body.applicantAnimationSoundVolume,
                    winnerTitle: req.body.winnerTitle,
                    winnerHeaderBackgroundColor: req.body.winnerHeaderBackgroundColor,
                    winnerHeaderTextColor: req.body.winnerHeaderTextColor,
                    winnerHeaderTextAlign: req.body.winnerHeaderTextAlign,
                    winnerBodyBackgroundColor: req.body.winnerBodyBackgroundColor,
                    winnerBodyTextColor: req.body.winnerBodyTextColor,
                    winnerBodyTextAlign: req.body.winnerBodyTextAlign,
                    winnerAnimationFrom: req.body.winnerAnimationFrom,
                    winnerAnimationTo: req.body.winnerAnimationTo,
                    winnerAnimationDelay: req.body.winnerAnimationDelay,
                    winnerAnimationMoveSpeed: req.body.winnerAnimationMoveSpeed,
                    winnerAnimationSoundVolume: req.body.winnerAnimationSoundVolume
                })
                .then( () => {
                    res.redirect('/setup/setup');
                })
                .catch( (error) => {
                    res.render('setup/index', {
                        title: i18n.__("Global setup"),
                        media: null,
                        error: error,
                        session: req.session,
                        openTab: 'setup'
                    });
                });
            }
            else {
                setup.widgetTitle = req.body.widgetTitle;
                setup.widgetHeaderBackgroundColor = req.body.widgetHeaderBackgroundColor;
                setup.widgetHeaderTextColor = req.body.widgetHeaderTextColor;
                setup.widgetHeaderTextAlign = req.body.widgetHeaderTextAlign;
                setup.widgetHeaderShowAvatar = req.body.widgetHeaderShowAvatar;
                setup.widgetHeaderAvatarAlign = req.body.widgetHeaderAvatarAlign;
                setup.widgetHeaderAvatarRounded = req.body.widgetHeaderAvatarRounded;
                setup.widgetBodyBackgroundColor = req.body.widgetBodyBackgroundColor;
                setup.widgetBodyTextColor = req.body.widgetBodyTextColor;
                setup.widgetBodyTextAlign = req.body.widgetBodyTextAlign;
                setup.widgetShowShortlink = req.body.widgetShowShortlink;
                setup.widgetShowShortPrependText = req.body.widgetShowShortPrependText;
                setup.widgetImageTransparency = req.body.widgetImageTransparency;
                setup.widgetBodyImagePadding = req.body.widgetBodyImagePadding;
                setup.applicantTitle = req.body.applicantTitle;
                setup.applicantHeaderBackgroundColor = req.body.applicantHeaderBackgroundColor;
                setup.applicantHeaderTextColor = req.body.applicantHeaderTextColor;
                setup.applicantHeaderTextAlign = req.body.applicantHeaderTextAlign;
                setup.applicantBodyBackgroundColor = req.body.applicantBodyBackgroundColor;
                setup.applicantBodyTextColor = req.body.applicantBodyTextColor;
                setup.applicantBodyTextAlign = req.body.applicantBodyTextAlign;
                setup.applicantAnimationFrom = req.body.applicantAnimationFrom;
                setup.applicantAnimationTo = req.body.applicantAnimationTo;
                setup.applicantAnimationDelay = req.body.applicantAnimationDelay;
                setup.applicantAnimationMoveSpeed = req.body.applicantAnimationMoveSpeed;
                setup.applicantAnimationSoundVolume = req.body.applicantAnimationSoundVolume;
                setup.winnerTitle = req.body.winnerTitle;
                setup.winnerHeaderBackgroundColor = req.body.winnerHeaderBackgroundColor;
                setup.winnerHeaderTextColor = req.body.winnerHeaderTextColor;
                setup.winnerHeaderTextAlign = req.body.winnerHeaderTextAlign;
                setup.winnerBodyBackgroundColor = req.body.winnerBodyBackgroundColor;
                setup.winnerBodyTextColor = req.body.winnerBodyTextColor;
                setup.winnerBodyTextAlign = req.body.winnerBodyTextAlign;
                setup.winnerAnimationFrom = req.body.winnerAnimationFrom;
                setup.winnerAnimationTo = req.body.winnerAnimationTo;
                setup.winnerAnimationDelay = req.body.winnerAnimationDelay;
                setup.winnerAnimationMoveSpeed = req.body.winnerAnimationMoveSpeed;
                setup.winnerAnimationSoundVolume = req.body.winnerAnimationSoundVolume;
                setup.save()
                .then( () => {
                    res.redirect('/setup/setup');
                })
                .catch( (error) => {
                    res.render('setup/index', {
                        title: i18n.__("Global setup"),
                        media: null,
                        error: error,
                        session: req.session,
                        openTab: 'setup'
                    });
                });
            }
        })
        .catch( (error) => {
            res.render('setup/index', {
                title: i18n.__("Global setup"),
                media: null,
                error: error,
                session: req.session,
                openTab: 'setup'
            });
        });
    }
};

module.exports = controller;