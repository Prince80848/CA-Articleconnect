
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim()
});
cloudinary.api.resources({ resource_type: 'raw', type: 'upload', prefix: 'articleconnect_resumes/', max_results: 1 })
  .then(res => console.log(res.resources[0].url))
  .catch(err => console.error(err));

