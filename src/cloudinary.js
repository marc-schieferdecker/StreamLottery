'use strict';

const path = require('path');
const config = require(path.join(__dirname,'..','config.json'));
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

// Configure cloudinary API access
cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
});

let storage = {
    AvatarUpload: () => {
        let storageOptions = cloudinaryStorage({
            cloudinary: cloudinary,
            folder: "avatars",
            allowedFormats: ["jpg", "png", "gif"],
            transformation: [{ width: 500, height: 500, crop: "fill", gravity: "center" }]
        });
        return multer({ storage: storageOptions, onError: storage.errorHandler });
    },

    AnimationsUpload: () => {
        let storageOptions = cloudinaryStorage({
            cloudinary: cloudinary,
            folder: "animations",
            allowedFormats: ["gif"]
        });
        return multer({ storage: storageOptions, onError: storage.errorHandler });
    },

    ImagesUpload: () => {
        let storageOptions = cloudinaryStorage({
            cloudinary: cloudinary,
            folder: "images",
            allowedFormats: ["jpg", "png", "gif"],
            transformation: [{ width: 1000 }]
        });
        return multer({ storage: storageOptions, onError: storage.errorHandler });
    },

    SoundsUpload: () => {
        let storageOptions = cloudinaryStorage({
            cloudinary: cloudinary,
            folder: "sounds",
            allowedFormats: ["wav", "mp3", "ogg"],
            params: {
                resource_type: "video"
            }
        });
        return multer({ storage: storageOptions, onError: storage.errorHandler });
    },

    deleteFile: (public_id) => {
        return new Promise( (resolve, reject) => {
            cloudinary.uploader.destroy(public_id, (result)=> {
                if(result.error == null) {
                    resolve(result);
                }
                else {
                    reject(result);
                }
            });
        });
    },

    errorHandler: (err, next) => {
        console.log('error', err);
        next(err);
    }
};

module.exports = storage;