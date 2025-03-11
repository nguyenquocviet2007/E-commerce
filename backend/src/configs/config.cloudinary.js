"use strict";
require('dotenv').config();
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'ecommercev',
    api_key: '595754466288174',
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary