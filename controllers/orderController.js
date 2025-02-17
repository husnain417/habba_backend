// controllers/orderController.js
const Order = require('../models/order');
const NotificationService = require('../services/notificationService');
const TemplateGenerator = require('../utils/templateGenerator');

class OrderController {
  constructor() {
    this.notificationService = new NotificationService();
  }

  async createOrder(req, res) {
    try {
      // Validate request body
      if (!req.body.items || !req.body.items.length) {
        return res.status(400).json({
          success: false,
          message: 'Order must contain at least one item',
        });
      }

      // Create new order
      const order = new Order({
        ...req.body,
        status: 'pending',
        createdAt: new Date(),
      });

      await order.save();

      const notificationPromises = [
        this.notificationService.sendEmail(
          order.email,
          'Order Confirmation',
          TemplateGenerator.generateOrderEmailHtml(order)
        ),
        this.notificationService.sendWhatsApp(
          TemplateGenerator.generateWhatsAppMessage(order),
          process.env.ADMIN_WHATSAPP_NUMBER
        ),
      ];

      // Wait for all notifications to be sent
      await Promise.allSettled(notificationPromises);

      return res.status(201).json({
        success: true,
        message: 'Order created successfully',
        orderId: order._id,
      });

    } catch (error) {
      console.error('Order creation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error processing order',
        error: error.message,
      });
    }
  }
}

// Export as object with methods instead of class instance
module.exports = {
  createOrder: (req, res) => new OrderController().createOrder(req, res)
};