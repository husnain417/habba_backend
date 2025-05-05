require('dotenv').config({ path: '../.env' });

const dbUrl = process.env.DB_URL;
const port = process.env.PORT || 5000;

module.exports = {
  dbUrl,
  port,
};
