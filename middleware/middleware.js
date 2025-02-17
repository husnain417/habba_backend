// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Add this line
const express = require('express');


const setupMiddleware = (app) => {
  // Serve static files
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get product name from request body
    let productName = req.body.name 
    ? req.body.name.replace(/[^a-zA-Z0-9_-]/g, "_") // Remove unwanted characters
    : "default";
  
    // Define folder path (uploads/products/{productName}/images)
    const uploadPath = `uploads/products/${productName}`;

    // Create folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});


module.exports = {upload, setupMiddleware};