const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/uploadMiddleware');
const uploadController = require('../controllers/uploadController');
const multer = require('multer');

// POST /api/upload
// Note: 'file' is the name of the field in the multipart/form-data request
router.post('/', (req, res, next) => {
  uploadMiddleware.single('file')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading (e.g., file too large)
      return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred (e.g., wrong file type)
      return res.status(400).json({ success: false, message: err.message });
    }
    // Everything went fine, pass to controller
    next();
  });
}, uploadController.uploadFile);

module.exports = router;
