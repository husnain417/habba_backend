require('dotenv').config();
const http = require('http');
const path = require('path'); // ✅ Import path module
const connectDB = require('./utils/dbConn');
const { port } = require('./utils/env');
const express = require('express');
const { setupMiddleware } = require('./middleware/middleware');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes')
const app = express();
const cors = require('cors');

setupMiddleware(app);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: '*', // Allow all origins (Modify this for security)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.set('view engine', 'ejs');
app.use(productRoutes);
app.use(orderRoutes);

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/about-us', (req, res) => {
  res.redirect('/about');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Healthy', timestamp: new Date() });
});


app.get('/create', (req, res) => {
  res.render('create', { title: 'Create Blog' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Error' });
});

const startServer = async () => {
  await connectDB();

  http.createServer(app).listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();

module.exports = app;
