"use strict";
const cloudinary = require('../configs/config.cloudinary')
// 1. upload fromo url image
const uploadFromUrl = async() => {
    try {
        const urlImage = 'https://down-vn.img.susercontent.com/file/sg-11134301-7rdvl-lyyp5aembp2v70.webp'
        const folderName = 'product/shopId', newFileName = 'test-demo'

        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName,
        })
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
}

// 2. upload from image local
const uploadFromLocal = async(
    path,
    folderName = 'product/2007'
) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: `thumb-${Date.now()}`,
            folder: folderName,
        })
        console.log(result);
        return {
            image_url: result.secure_url,
            shopId: 2007,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'jpg'
            })
        }
    } catch (error) {
        
    }
}

module.exports = {
    uploadFromUrl,
    uploadFromLocal
}