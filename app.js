require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const usersController = require('./controllers/usersController');
const donationsController = require('./controllers/donationsController');
const authenticateToken = require('./middlewares/authenticateToken');
const dbConfig = require('./config/dbConfig');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// User routes
app.post('/api/signup', usersController.createUser);
app.post('/api/login', usersController.loginUser);

// Protected donation route
app.post('/api/donate', authenticateToken, donationsController.createDonation);

// Start the server and connect to the database
app.listen(port, async () => {
  try {
    await sql.connect(dbConfig);
    console.log(`Database connected and server running on port ${port}`);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await sql.close();
  process.exit(0);
});
