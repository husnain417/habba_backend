const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {upload} = require('../middleware/middleware');

// Product routes
router.post('/products', upload.array('images', 3), productController.addProduct);
router.patch('/update/:id', productController.updateProduct);
router.delete('/remove/:id', productController.removeProduct);
router.get('/products',productController.getAllProducts);

module.exports = router;