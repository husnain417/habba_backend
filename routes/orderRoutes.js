// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const contactController = require('../controllers/contactController');

router.post('/orders', orderController.createOrder);

router.post('/contact', contactController);

module.exports = router;