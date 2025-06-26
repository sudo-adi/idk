const multer = require("multer");
const path = require("path");
const ApiResponse = require("../utils/response");

// Configure multer for memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return ApiResponse.error(res, "File size too large. Maximum 5MB allowed.", 400);
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return ApiResponse.error(res, "Too many files. Maximum 5 files allowed.", 400);
    }
    return ApiResponse.error(res, `Upload error: ${err.message}`, 400);
  }
  
  if (err) {
    return ApiResponse.error(res, err.message, 400);
  }
  
  next();
};

module.exports = {
  upload,
  handleMulterError,
};
