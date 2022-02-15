require('dotenv').config();
const cloudinary = require('cloudinary').v2

const {cloudinaryName, cloudinaryUrl, cloudinaryApiKey ,cloudinaryApiSecret } = process.env;

cloudinary.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
  secure: true
});

const uploadImage = async (imagePath) =>{
  cloudinary.uploader.upload(imagePath,
  {resource_type: "image",
  overwrite: true},
  function(error, result) {console.log(result, error)});
}

module.exports = {
  uploadImage
}
