const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the resource type based on mime type
    let resourceType = 'image';
    if (file.mimetype === 'application/pdf') {
      resourceType = 'raw'; // Cloudinary handles PDFs as 'raw' or 'image'. We'll use 'raw' for direct downloads or 'image' if we want rasterization. Let's use 'auto'.
    }
    
    return {
      folder: 'file-upload-system',
      resource_type: 'auto',
      public_id: Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname.split('.')[0]
    };
  },
});

// File filter for images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed.'), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
