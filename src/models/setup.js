'use strict';

let mongoose = require('mongoose');
let i18n = require('i18n');

const SetupSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, i18n.__("can't be blank")]
    },

    /* Widget properties */
    widgetTitle: {
        type: String,
        trim: true
    },
    widgetHeaderBackgroundColor: {
        type: String,
        trim: true
    },
    widgetHeaderTextColor: {
        type: String,
        trim: true
    },
    widgetHeaderTextAlign: {
        type: String,
        trim: true
    },
    widgetHeaderShowAvatar: {
        type: String,
        trim: true
    },
    widgetHeaderAvatarAlign: {
        type: String,
        trim: true
    },
    widgetHeaderAvatarRounded: {
        type: String,
        trim: true
    },
    widgetBodyBackgroundColor: {
        type: String,
        trim: true
    },
    widgetBodyTextColor: {
        type: String,
        trim: true
    },
    widgetBodyTextAlign: {
        type: String,
        trim: true
    },
    widgetBodyImagePadding: {
        type: String,
        trim: true
    },
    widgetShowShortlink: {
        type: String,
        trim: true
    },
    widgetShowShortPrependText: {
        type: String,
        trim: true
    },
    widgetImageTransparency: {
        type: String,
        trim: true
    },

    /* Applicant animation properties */
    applicantTitle: {
        type: String,
        trim: true
    },
    applicantHeaderBackgroundColor: {
        type: String,
        trim: true
    },
    applicantHeaderTextColor: {
        type: String,
        trim: true
    },
    applicantHeaderTextAlign: {
        type: String,
        trim: true
    },
    applicantBodyBackgroundColor: {
        type: String,
        trim: true
    },
    applicantBodyTextColor: {
        type: String,
        trim: true
    },
    applicantBodyTextAlign: {
        type: String,
        trim: true
    },
    applicantAnimationFrom: {
        type: String,
        trim: true
    },
    applicantAnimationTo: {
        type: String,
        trim: true
    },
    applicantAnimationDelay: {
        type: String,
        trim: true
    },
    applicantAnimationMoveSpeed: {
        type: String,
        trim: true
    },
    applicantAnimationSoundVolume: {
        type: String,
        trim: true
    },

    /* Winner animation properties */
    winnerTitle: {
        type: String,
        trim: true
    },
    winnerHeaderBackgroundColor: {
        type: String,
        trim: true
    },
    winnerHeaderTextColor: {
        type: String,
        trim: true
    },
    winnerHeaderTextAlign: {
        type: String,
        trim: true
    },
    winnerBodyBackgroundColor: {
        type: String,
        trim: true
    },
    winnerBodyTextColor: {
        type: String,
        trim: true
    },
    winnerBodyTextAlign: {
        type: String,
        trim: true
    },
    winnerAnimationFrom: {
        type: String,
        trim: true
    },
    winnerAnimationTo: {
        type: String,
        trim: true
    },
    winnerAnimationDelay: {
        type: String,
        trim: true
    },
    winnerAnimationMoveSpeed: {
        type: String,
        trim: true
    },
    winnerAnimationSoundVolume: {
        type: String,
        trim: true
    },
}, {timestamps: true});

module.exports = mongoose.model('Setup', SetupSchema);
