require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const sql = require('mssql');
const dbConfig = require('./dbConfigs');
const authMiddleware = require('./middleware/authMiddleware');
const appConfig = require('../config/appConfig');

// Import routes
const userRoutes = require('./Controllers/userController');
const bookRoutes = require('./Controllers/bookController');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // HTTP request logger

// Routes
app.post('/register', userRoutes.registerUser);
app.post('/login', userRoutes.loginUser);
app.get('/books', authMiddleware, bookRoutes.getAllBooks);
app.put('/books/:bookId/availability', authMiddleware, bookRoutes.updateBookAvailability);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Polytechnic Library API');
});

// Connect to database
const startServer = async () => {
  try {
    await sql.connect(dbConfig);
    console.log('Connected to database');
    
    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

// Start server and database connection
startServer();

module.exports = app; // Export app for testing purposes
