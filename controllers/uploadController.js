exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded or invalid file format.'
    });
  }

  // With Cloudinary, the file URL is provided directly in req.file.path
  const fileUrl = req.file.path;

  res.status(200).json({
    success: true,
    message: 'File securely uploaded to Cloudinary!',
    file: {
      originalName: req.file.originalname,
      fileName: req.file.filename || req.file.public_id,
      mimeType: req.file.mimetype,
      size: req.file.size,
      downloadUrl: fileUrl
    }
  });
};
