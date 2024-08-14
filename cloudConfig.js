const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//configaration of the storage
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  //api_secret and others are by default these names itself, you have to use them omly, while we can name our keys in .env as per our choice
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wanderlust_DEV",
        allowedFormats: ["png", "jpg", "jpeg"],
    },
});

module.exports = {
    cloudinary,
    storage
};