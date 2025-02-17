const Product = require('../models/product');

const productController = {
  // Add new product with images
  addProduct: async (req, res) => {
    try {
      const productData = req.body;
      
      // Check if images were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please upload at least one image (maximum 3)'
        });
      }

      // Validate number of images
      if (req.files.length > 3) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 3 images allowed'
        });
      }

      productData.images = req.files.map(file => file.path);
      
      const requiredFields = ['name', 'price', 'oldPrice', 'category', 'description'];
      const missingFields = requiredFields.filter(field => !productData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      const product = new Product(productData);
      await product.save();
      
      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find({})
        .sort({ createdAt: -1 }); // Sort by newest first
  
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update product (improved version)
  updateProduct: async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['name', 'price', 'description'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({
          success: false,
          message: 'Invalid updates!'
        });
      }

      const product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Update only the fields that were sent
      updates.forEach(update => {
        product[update] = req.body[update];
      });

      await product.save(); // This will run validators

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Remove product
  removeProduct: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product removed successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = productController;