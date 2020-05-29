'use strict';

let mongoose = require('mongoose');
let i18n = require('i18n');

const MediaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, i18n.__("can't be blank")]
    },
    fieldname: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    originalname: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    mimetype: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    format: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    bytes: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    public_id: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    url: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    secure_url: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Media', MediaSchema);
