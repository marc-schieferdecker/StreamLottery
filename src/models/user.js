'use strict';

var mongoose = require('mongoose');
var i18n = require('i18n');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, i18n.__("can't be blank")],
        match: [/\S+@\S+\.\S+/, "is invalid"],
        unique: true,
        index: true,
        trim: true
    },
    password: {
        type: String
    },
    timezone: {
        type: String,
        required: [true, i18n.__("can't be blank")],
        trim: true
    },
    avatarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        default: null
    },
    salt: {
        type: String
    }
}, {timestamps: true, strict: false, toObject: {virtuals:true}});

// Check for unique fields
UserSchema.plugin(uniqueValidator, {message: i18n.__("is already in use")});

// Hash password
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

// Check if password is valid
UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.password === hash;
};

// Hash password on save
UserSchema.pre('save', function(next) {
    var user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // Hash plain text password and continue
    user.setPassword(user.password);
    next();
});

// Authenticate
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            if (user.validPassword(password)) {
                return callback(null, user);
            } else {
                return callback();
            }
        });
};

// Populate
UserSchema.virtual('setup', {
    ref: 'Setup',
    localField: '_id',
    foreignField: 'userId',
    justOne: true
});
UserSchema.pre('findOne', function() {
    this.populate('avatarId');
    this.populate('setup');
});
UserSchema.pre('find', function() {
    this.populate('avatarId');
    this.populate('setup');
});

module.exports = mongoose.model('User', UserSchema);
