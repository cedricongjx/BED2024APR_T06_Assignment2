require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const usersController = require('./controllers/usersController');
const donationsController = require('./controllers/donationsController');
const statisticsController = require('./controllers/statisticsController');
const authenticateToken = require('./middlewares/authenticateToken');
const validationMiddleware = require('./middlewares/validate');
const dbConfig = require('./config/dbConfig');

//const usersController = require('./controllers/usersController'); // Ensure correct path
const feedbackController = require('./controllers/feedbackController');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// User routes
app.post('/api/signup', validationMiddleware.validateSignup, usersController.createUser);
app.post('/api/login', validationMiddleware.validateLogin, usersController.loginUser);
app.get('/api/users', usersController.getAllUsers);
app.get('/api/users/:id', validationMiddleware.validateUserIdParam, usersController.getUserById);
app.put('/api/users/:id', validationMiddleware.validateUserIdParam, validationMiddleware.validateUserUpdate, usersController.updateUser);
app.delete('/api/users/:id', validationMiddleware.validateUserIdParam, usersController.deleteUser);

app.post('/api/donate', authenticateToken, donationsController.createDonation);

// Add this new route for fetching top donors
app.get('/api/top-donors', donationsController.getTopDonors);

// Statistics route
app.get('/api/statistics', statisticsController.getStatistics);

//Feedback
app.put("/feedback/response",feedbackController.editResponse);

app.get("/feedback/name",feedbackController.getFeedbackByName);
app.get("/feedback",feedbackController.getAllFeedback);
app.get("/feedback/notverified",feedbackController.getAllNotVerifiedFeedback);
app.get("/feedback/verified",feedbackController.getAllVerifiedFeedback);
app.get("/feedback/bug",feedbackController.getAllBugFeedback);
app.get("/feedback/customerservice",feedbackController.getAllCustomerServiceFeedback);
app.get("/feedback/feedback",feedbackController.getAllfeedbackFeedback)
app.get("/feedback/other",feedbackController.getAllOtherFeedback);
app.post("/feedback",feedbackController.createFeedback)
app.put("/feedback/:id",feedbackController.updateFeedback)
app.delete("/feedback/:id",feedbackController.deleteFeedback);

app.post("/feedback/verified",feedbackController.addJustification);
app.get("/feedback/response/:id",feedbackController.getResponse);



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
