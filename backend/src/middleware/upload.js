const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_NAME || '').trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim()
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const ext = path.extname(file.originalname).toLowerCase();

        if (ext === '.pdf' || ext === '.doc' || ext === '.docx') {
            // resource_type:'raw' stores the file exactly as-is (binary preserved).
            // This is the ONLY correct type for PDFs/docs on Cloudinary.
            // The URL is publicly accessible and Chrome can open it in a new tab.
            return {
                folder: 'cahire_resumes',
                resource_type: 'raw',
                public_id: `resume-${Date.now()}${ext}`,
            };
        } else {
            // Images (avatars, logos, etc.)
            return {
                folder: 'cahire_images',
                resource_type: 'image',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                public_id: `img-${Date.now()}`,
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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});

module.exports = upload;
