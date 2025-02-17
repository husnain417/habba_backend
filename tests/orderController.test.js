// tests/orderController.test.js
const request = require('supertest');
const app = require('../app'); // Your Express app
const Order = require('../models/order');
const mongoose = require('mongoose');

// Sample test data
const sampleOrder = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  address: '123 Test Street',
  city: 'Test City',
  country: 'Test Country',
  items: [
    {
      name: 'Test Product',
      quantity: 2,
      price: 1000
    }
  ],
  totalAmount: 2000,
  paymentMethod: 'COD'
};

describe('Order Controller Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    // Cleanup
    await Order.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear orders before each test
    await Order.deleteMany({});
  });

  test('Should create a new order', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send(sampleOrder);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.orderId).toBeDefined();

    // Verify order in database
    const order = await Order.findById(response.body.orderId);
    expect(order).toBeDefined();
    expect(order.email).toBe(sampleOrder.email);
  });

  test('Should reject order with no items', async () => {
    const invalidOrder = { ...sampleOrder, items: [] };
    
    const response = await request(app)
      .post('/api/orders')
      .send(invalidOrder);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

// Manual test script
const axios = require('axios');

async function testOrderCreation() {
  try {
    const response = await axios.post('http://localhost:3000/api/orders', sampleOrder);
    console.log('Order created successfully:', response.data);
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
  }
}

// Run manual test
testOrderCreation();