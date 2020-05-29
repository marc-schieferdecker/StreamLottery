'use strict';

let mongoose = require('mongoose');
let i18n = require('i18n');

const LotterySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, i18n.__("can't be blank")]
    },
    name: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    description: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    winningAnimationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        default: null
    },
    productImageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        default: null
    },
    winningSoundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        default: null
    },
    newApplicantSoundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        default: null
    },
    isPublic: {
        type: Boolean
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Applicant",
        default: null
    }],
    shortlinkForm: {
        type: String,
        default: null
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Applicant",
        default: null
    }
}, {timestamps: true});

// Population
LotterySchema.pre('findOne', function() {
    this.populate('winningAnimationId');
    this.populate('productImageId');
    this.populate('winningSoundId');
    this.populate('newApplicantSoundId');
    this.populate('applicants');
    this.populate('winner');
    this.populate('userId');
});
LotterySchema.pre('find', function() {
    this.populate('winningAnimationId');
    this.populate('productImageId');
    this.populate('winningSoundId');
    this.populate('newApplicantSoundId');
    this.populate('applicants');
    this.populate('winner');
    this.populate('userId');
});

module.exports = mongoose.model('Lottery', LotterySchema);
