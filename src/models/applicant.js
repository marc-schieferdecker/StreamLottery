'use strict';

var mongoose = require('mongoose');
var i18n = require('i18n');

const ApplicantSchema = new mongoose.Schema({
    lotteryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lottery",
        required: [true, i18n.__("can't be blank")]
    },
    email: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    publicName: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    publicMessage: {
        type: String,
        trim: true
    },
    publicWinningMessage: {
        type: String,
        trim: true
    },
    deliverName: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    deliverStreet: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    deliverZip: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    deliverTown: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    deliverCountry: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Applicant', ApplicantSchema);
