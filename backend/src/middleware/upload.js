const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary using existing env variables
cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_NAME || '').trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim()
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        
        // Return structured parameters based on file type
        if (ext === '.pdf' || ext === '.doc' || ext === '.docx') {
            return {
                folder: 'articleconnect_resumes',
                resource_type: 'raw', // Critical for PDFs/Docs on Cloudinary
                public_id: `${file.fieldname}-${Date.now()}`
            };
        } else {
            return {
                folder: 'articleconnect_images',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                public_id: `${file.fieldname}-${Date.now()}`
            };
        }
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isDocument = ['.pdf', '.doc', '.docx'].includes(ext);
    const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);

    if (isDocument || isImage) {
        cb(null, true);
    } else {
        cb(new Error('Only PDFs, DOCs, and image files (JPG, PNG) are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

module.exports = upload;
